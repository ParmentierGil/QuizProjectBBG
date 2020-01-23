from flask import Flask
from flask import request
from flask_socketio import SocketIO, send, emit
from flask_cors import CORS
from flask import jsonify
from urllib import parse
import sqlalchemy as db
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, alias
import random
import string
import uuid
import json


app = Flask(__name__)

baseURI = '/api/v1/'

connecting_string = 'Driver={ODBC Driver 17 for SQL Server};Server=tcp:hartslagquiz.database.windows.net,1433;Database=hartslagdb;Uid=hartslagdbuser;Pwd=kinderspelhartquiz420$;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30';
params = parse.quote_plus(connecting_string)

engine = db.create_engine("mssql+pyodbc:///?odbc_connect=%s" % params)
connection = engine.connect()
Session = sessionmaker()
Session.configure(bind=engine)
Base = declarative_base()

CORS(app)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")
socketio.emit('connect')


# <editor-fold desc="Classes">
class Game(Base):
    __tablename__ = 'Game'
    GameId = Column(String(50), primary_key=True)
    JoinCode = Column(String(4))
    QuestionCount = Column(Integer)

    def __repr__(self):
        return "<Game(GameID='%s', JoinCode='%s', QuestionCount='%s')>" % (
                                self.GameId, self.JoinCode, self.QuestionCount)


class Player(Base):
    __tablename__ = 'Player'
    PlayerId = Column(String(50), primary_key=True)
    Username = Column(String(10))

    def __repr__(self):
        return "<Player(PlayerId='%s', Username='%s')>" % (
                                self.PlayerId, self.Username)


class GamePlayer(Base):
    __tablename__ = 'GamePlayer'
    PlayerId = Column(String(50), primary_key=True)
    GameId = Column(String(50))

    def __repr__(self):
        return "<Player(PlayerId='%s', GameId='%s')>" % (
                                self.PlayerId, self.GameId)
# </editor-fold>

#<editor-fold desc="Useful Functions">

def random_string(string_length):
    letters = string.ascii_uppercase
    return ''.join(random.choice(letters) for i in range(string_length))
#</editor-fold>

#<editor-fold desc="Approutes">
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
# </editor-fold>

def get_game_questions(question_count):
    session = Session()
    questions = []
    try:
        sql = f'SELECT TOP {question_count} * FROM Question ORDER BY NEWID()'
        result = session.execute(sql)
        for row in result:
            d = dict(row.items())
            questions.append(d)
            #print("res:", row['QuestionText'])
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
            #print("res:", row['Description'])
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
        print('Error while getting question count   ' + str(e))


def save_player(username):
    session = Session()
    try:
        player_id = uuid.uuid4()
        new_player = Player(PlayerId=player_id, Username=username)
        session.add(new_player)
        session.commit()
        emit('playerid', str(player_id))
        session.close()
    except Exception as e:
        print('Error while saving player ' + str(e))


def game_exists(join_code, player_id):
    session = Session()
    try:
        result = session.query(Game).filter(Game.JoinCode == join_code).first()
        print(result)
        if result == None:
            print(result)
            return False
        else:
            game_player = GamePlayer(PlayerId=player_id, GameId=result.GameId)
            session.add(game_player)
            session.commit()
            return True
    except Exception as e:
        print('Error while checking if game exists ' + str(e))


#SOCKET IO
@socketio.on('clientconnected')
def connected(data):
    print('client connected to the socket')


@socketio.on('startgame')
def start_game(data):
    joincode = data['join code']
    question_count = get_question_count(joincode)
    game_questions = get_game_questions(question_count)
    exercises = get_exercises(question_count)
    q_and_e_json = game_questions + exercises
    print(game_questions)
    socketio.emit('game_started_questions', game_questions)
    socketio.emit('game_started_exercises', exercises)


@socketio.on('joingame')
def join_game(data):
    join_code = data['joincode']
    player_id = data['playerid']
    print('xxx'+player_id)
    if game_exists(join_code, player_id):
        emit('joinCodeCorrect'+player_id, join_code)
    else:
        emit('joinCodeFalse'+player_id)


@socketio.on('makeplayer')
def make_player(data):
    username = data['username']
    print(username)
    save_player(username)

@socketio.on('newheartrate', )
def new_heartrate(data):
    heartrate = data['heartrate']

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port="5500", debug=True)