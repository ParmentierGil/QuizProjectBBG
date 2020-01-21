from flask import Flask
from flask import request
from flask_mqtt import Mqtt
from flask import jsonify
from urllib import parse
import sqlalchemy as db
from sqlalchemy.orm import sessionmaker
import random
import string


app = Flask(__name__)

baseURI = '/api/v1/'

connecting_string = 'Driver={ODBC Driver 17 for SQL Server};Server=tcp:hartslagquiz.database.windows.net,1433;Database=hartslagdb;Uid=hartslagdbuser;Pwd=kinderspelhartquiz420$;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30';
params = parse.quote_plus(connecting_string)

engine = db.create_engine("mssql+pyodbc:///?odbc_connect=%s" % params)
connection = engine.connect();
Session = sessionmaker()
Session.configure(bind=engine)

app.config['MQTT_BROKER_URL'] = 'broker.hivemq.com'  # use the free broker from HIVEMQ
app.config['MQTT_BROKER_PORT'] = 1883  # default port for non-tls connection
app.config['MQTT_USERNAME'] = ''  # set the username here if you need authentication for the broker
app.config['MQTT_PASSWORD'] = ''  # set the password here if the broker demands authentication
app.config['MQTT_KEEPALIVE'] = 5  # set the time interval for sending a ping to the broker to 5 seconds
app.config['MQTT_TLS_ENABLED'] = False  # set TLS to disabled for testing purposes

mqtt = Mqtt(app)

#example
result = connection.execute('select * from Question')
for row in result:
    print("res:", row['QuestionText'])

def random_string(string_length):
    letters = string.ascii_uppercase
    return ''.join(random.choice(letters) for i in range(string_length))

@app.route('/')
def hello_world():
    return 'Hello World'

@app.route(baseURI+'makegame')
def make_game():
    joincode = random_string(4)
    question_count = 5
    try:
        sql = "insert into Game (GameId, JoinCode, QuestionCount) values (NEWID(), ?, ?)"
        result = connection.execute(sql, joincode, question_count)
        return jsonify("Game created!")
    except Exception as e:
        return jsonify('Error while creating room'+str(e)), 500

@app.route(baseURI+'gamequestions')
def game_questions():
    session = Session()
    joincode = 'KBIS'
    questions = []
    try:
        question_count_sql = 'SELECT QuestionCount FROM Game WHERE JoinCode = :joincode'
        qc_result = session.execute(question_count_sql, {'joincode': joincode})
        for row in qc_result:
            question_count = row['QuestionCount']
            print("res:", row['QuestionCount'])

        sql = f'SELECT TOP {question_count} * FROM Question ORDER BY NEWID()'
        result = session.execute(sql)
        for row in result:
            d = dict(row.items())
            questions.append(d)
            print("res:", row['QuestionText'])
        session.close();
        return jsonify(questions),200
    except Exception as e:
        return jsonify('Error while getting gamequestions'+str(e)), 500


@app.route(baseURI+'exercises')
def exercises():
    session = Session()
    joincode = 'KBIS'
    exercises = []
    try:
        question_count_sql = 'SELECT QuestionCount FROM Game WHERE JoinCode = :joincode'
        qc_result = session.execute(question_count_sql, {'joincode': joincode})
        for row in qc_result:
            question_count = row['QuestionCount']
            print("res:", row['QuestionCount'])

        sql = f'SELECT TOP {question_count} * FROM Exercise ORDER BY NEWID()'
        result = session.execute(sql)
        for row in result:
            d = dict(row.items())
            exercises.append(d)
            print("res:", row['Description'])
        session.close();
        return jsonify(exercises), 200
    except Exception as e:
        return jsonify('Error while getting exercises'+str(e)), 500



if __name__ == '__main__':
    app.run()
    mqtt.init_app(app)
'''    
result = session.execute(
            text("SELECT * FROM user WHERE id=:param"),
            {"param":5}
        )
'''
