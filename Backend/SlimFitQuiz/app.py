from flask import Flask
from flask import request
from flask_socketio import SocketIO, send, emit
from flask import jsonify
from urllib import parse
import sqlalchemy as db
from sqlalchemy.orm import sessionmaker
import random
import string
import json


app = Flask(__name__)

baseURI = '/api/v1/'

connecting_string = 'Driver={ODBC Driver 17 for SQL Server};Server=tcp:hartslagquiz.database.windows.net,1433;Database=hartslagdb;Uid=hartslagdbuser;Pwd=kinderspelhartquiz420$;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30';
params = parse.quote_plus(connecting_string)

engine = db.create_engine("mssql+pyodbc:///?odbc_connect=%s" % params)
connection = engine.connect();
Session = sessionmaker()
Session.configure(bind=engine)

app.config['SECRET_KEY'] = 'slimfit8500$'
socketio = SocketIO(app)

'''
#example
result = connection.execute('select * from Question')
for row in result:
    print("res:", row['QuestionText'])
'''

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
        return jsonify("Game created!"), 201
    except Exception as e:
        return jsonify('Error while creating game'+str(e)), 500


@app.route(baseURI+'playerjoin', methods=['GET', 'POST'])
def player():
    username = 'gil'
    joincode = 'KBIS'
    if(request.method == 'GET'):
        try:
            sql = "insert into Player (PlayerId, Username) values (NEWID(), ?)"
            result = connection.execute(sql, username)
            sql2 = "select PlayerId from Player where username = ?"
            result2 = connection.execute(sql2, username)
            playerid = ''
            for row in result:
                playerid = row['PlayerId']
            return jsonify("Joined game"), 201
        except Exception as e:
            return jsonify('Error while joining game ' + str(e)), 500


def get_game_questions(question_count):
    session = Session()
    questions = []
    try:
        sql = f'SELECT TOP {question_count} * FROM Question ORDER BY NEWID()'
        result = session.execute(sql)
        for row in result:
            d = dict(row.items())
            questions.append(d)
            print("res:", row['QuestionText'])
        session.close()
        return questions
    except Exception as e:
        print('Error while getting questions  '+str(e))


def get_exercises(question_count):
    session = Session()
    exercises = []
    try:
        sql = f'SELECT TOP {question_count} * FROM Exercise ORDER BY NEWID()'
        result = session.execute(sql)
        for row in result:
            d = dict(row.items())
            exercises.append(d)
            print("res:", row['Description'])
        session.close()
        return exercises
    except Exception as e:
        print('Error while getting exercises   '+str(e))


def get_question_count(joincode):
    session = Session()
    try:
        question_count_sql = 'SELECT QuestionCount FROM Game WHERE JoinCode = :joincode'
        qc_result = session.execute(question_count_sql, {'joincode': joincode})
        for row in qc_result:
            return row['QuestionCount']
    except Exception as e:
        print('Error while getting question count   '+str(e))


#SOCKET IO

#@socketio.on('start game')
def start_game(joincode):
    question_count = get_question_count(joincode)
    game_questions = get_game_questions(question_count)
    exercises = get_exercises(question_count)
    q_and_e_json = game_questions + exercises
    print(q_and_e_json)
    emit('game started', q_and_e_json)



if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)



