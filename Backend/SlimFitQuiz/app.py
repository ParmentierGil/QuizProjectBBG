from flask import Flask
from flask import request
from flask_socketio import SocketIO, send, emit
from flask_cors import CORS
from flask import jsonify
from urllib import parse
import sqlalchemy as db
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, ForeignKey
import random
import string
import uuid
import math
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
socketio = SocketIO(app)


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


class Question(Base):
    __tablename__ = 'Question'
    QuestionId = Column(String(50), primary_key=True)
    QuestionText = Column(String(200))
    CorrectAnswer = Column(String(200))
    WrongAnswer1 = Column(String(200))
    WrongAnswer2 = Column(String(200))
    WrongAnswer3 = Column(String(200))

    def __repr__(self):
        return "<Question(QuestionId='%s', QuestionText='%s', CorrectAnswer='%s', WrongAnswer1='%s', WrongAnswer2='%s', WrongAnswer3='%s')>" % (
                                self.QuestionId, self.QuestionText, self.CorrectAnswer, self.WrongAnswer1, self.WrongAnswer2, self.WrongAnswer3)


class GamePlayer(Base):
    __tablename__ = 'GamePlayer'
    PlayerId = Column(String(50), ForeignKey(Player.PlayerId), primary_key=True)
    GameId = Column(String(50), ForeignKey(Game.GameId), primary_key=True)
    Heartrate = Column(Integer)
    RestHeartrate = Column(Integer)
    TotalScore = Column(Integer)

    game = relationship(Game)
    player = relationship(Player)

    def __repr__(self):
        return "<Player(PlayerId='%s', GameId='%s', Heartrate='%s', RestHeartrate='%s')>" % (
                                self.PlayerId, self.GameId, self.Heartrate, self.RestHeartrate)


class GamePlayerQuestion(Base):
    __tablename__ = 'GamePlayerQuestion'
    PlayerId = Column(String(50), ForeignKey(Player.PlayerId), primary_key=True)
    GameId = Column(String(50), ForeignKey(Game.GameId), primary_key=True)
    QuestionId = Column(String(50), ForeignKey(Question.QuestionId), primary_key=True)
    Score = Column(Integer)

    game = relationship(Game)
    player = relationship(Player)
    question = relationship(Question)

    def __repr__(self):
        return "<GamePlayerQuestion(PlayerId='%s', GameId='%s', QuestionId='%s', Score='%s')>" % (
                                self.PlayerId, self.GameId, self.QuestionId, self.Score)

# </editor-fold>

#<editor-fold desc="Useful Functions">

def random_string(string_length):
    letters = string.ascii_uppercase
    return ''.join(random.choice(letters) for i in range(string_length))
#</editor-fold>


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
            print("game exists id:  " + player_id)
            game_player = GamePlayer(PlayerId=player_id, GameId=result.GameId, Heartrate=0, TotalScore=0)
            session.add(game_player)
            session.commit()
            return True
    except Exception as e:
        print('Error while checking if game exists ' + str(e))


def emit_scores(join_code):
    try:
        session = Session()
        game_id = session.query(Game).filter(Game.JoinCode == join_code).one().GameId
        gameplayers = session.query(GamePlayer).filter(GamePlayer.GameId == game_id)

        all_scores = []
        for gp in gameplayers:
            username = session.query(Player).filter(Player.PlayerId == gp.PlayerId).one().Username
            userscore = {'username': username, 'score': gp.TotalScore}
            all_scores.append(userscore)
        print('emitting all scores '+join_code)
        socketio.emit("alltotalscores"+join_code, all_scores)
    except Exception as e:
        print('Error while getting all total scores '+str(e))
'''
#SOCKET IO
@socketio.on('clientconnected')
def connected(data):
    print('client connected to the socket')

'''
@socketio.on('startgame')
def start_game(data):
    joincode = data['joincode']
    question_count = get_question_count(joincode)
    game_questions = get_game_questions(question_count)
    exercises = get_exercises(question_count)
    q_and_e_json = game_questions + exercises
    print(game_questions)
    socketio.emit('game_started_questions' + joincode, game_questions)
    socketio.emit('game_started_exercises' + joincode, exercises)


@socketio.on('joingame')
def join_game(data):
    join_code = data['joincode']
    player_id = data['playerid']
    if game_exists(join_code, player_id):
        try:
            socketio.emit('joinCodeCorrect'+player_id, join_code)
            session = Session()
            player = session.query(Player).filter(Player.PlayerId == player_id).one().Username
            print('joinCodeCorrect'+join_code)
            socketio.emit('joinCodeCorrect'+join_code, player)
        except Exception as e:
            print('Couldnt emit')
    else:
        emit('joinCodeFalse'+player_id)


@socketio.on('makeplayer')
def make_player(data):
    username = data['username']
    print(username)
    save_player(username)


@socketio.on('newheartrate')
def new_heartrate(data):
    session = Session()
    player_id = data['playerid']
    join_code = data['joincode']
    heartrate = data['heartrate']
    gameplayer = session.query(GamePlayer).filter(GamePlayer.PlayerId == player_id).one()
    gameplayer.Heartrate = heartrate
    session.commit()

    socketio.emit('newheartrate'+player_id, str(heartrate))

    player_names = []
    #session.query(Player, GamePlayer, Game).filter(Player.PlayerId == GamePlayer.PlayerId, Game.GameId == GamePlayer.GameId, Game.JoinCode == join_code).all():
    #    player_names.append(p.Username)
    username = session.query(Player).filter(Player.PlayerId == player_id).one().Username
    socketio.emit('newheartrate'+join_code, {'heartrate': str(heartrate), 'username': username})
    session.close()


@socketio.on('restheartrate')
def save_restheartrate(data):
    rest_heartrate = data['restheartrate']
    player_id = data['playerid']
    join_code = data['joincode']
    try:
        session = Session()
        gameplayer = session.query(GamePlayer).filter(GamePlayer.PlayerId == player_id).one()
        gameplayer.RestHeartrate = rest_heartrate
        session.commit()
        socketio.emit('restheartbeatset'+join_code)
    except Exception as e:
        print('Error while saving restheartrate '+ str(e))


@socketio.on('requiredheartrate')
def required_heartrate(data):
    join_code = data['joincode']
    player_id = data['playerid']
    question_number = data['questionnumber']
    question_count = data['questioncount']
    try:
        session = Session()
        game_id = session.query(Game).filter(Game.JoinCode == join_code).one().GameId
        rest_heartrate = session.query(GamePlayer).filter(GamePlayer.PlayerId == player_id, GamePlayer.GameId == game_id).one().RestHeartrate
        factor = 1.4
        for x in range(0, question_count):
            if x == question_number:
                break
            else:
                factor += 0.2
        print('Factor: '+str(factor))
        max_180 = min(rest_heartrate * factor, 180)
        min_110 = max(110, max_180)
        req_heartrate = math.ceil(min_110)
        print('Req: '+str(req_heartrate))
        socketio.emit('requiredheartrate'+player_id, req_heartrate)
        session.close()
    except Exception as e:
        print('Error while getting rest heartrate ' + str(e))


@socketio.on('makegame')
def make_game(data):
    print(data)
    joincode = random_string(4)
    question_count = data['questioncount']
    game_id = uuid.uuid4()
    try:
        session = Session()
        new_game = Game(GameId=str(game_id), JoinCode=joincode, QuestionCount=question_count)
        session.add(new_game)
        session.commit()
        socketio.emit('gamemade', joincode)
    except Exception as e:
        print('Error while making game '+str(e))


@socketio.on('answeredcorrectly')
def save_score(data):
    player_id = data['playerid']
    joincode = data['joincode']
    question_id = data['questionid']
    score = data['score']
    session = Session()
    try:
        game = session.query(Game).filter(Game.JoinCode == joincode).one()
        game_id = game.GameId
        new_gameplayerquestion = GamePlayerQuestion(GameId=game_id, PlayerId=player_id, QuestionId=question_id, Score=score)
        session.add(new_gameplayerquestion)
        session.commit()
        gameplayer = session.query(GamePlayer).filter(GamePlayer.GameId == game_id, GamePlayer.PlayerId == player_id).one()
        gameplayer.TotalScore += score
        session.commit()
        print('player saved')
        socketio.emit('scoresaved' + player_id)
        print('trying to emit all scores on: '+joincode)
        emit_scores(joincode)
        session.close()
    except Exception as e:
        print('Error while saving ' + str(e))

@socketio.on('alltotalscores')
def all_totalscores(data):
    join_code = data['joincode']
    emit_scores(join_code)


@socketio.on('mytotalscore')
def my_totalscore(data):
    player_id = data['playerid']
    join_code = data['joincode']
    try:
        session = Session()
        game_id = session.query(Game).filter(Game.JoinCode == join_code).one().GameId
        total_score = session.query(GamePlayer).filter(GamePlayer.GameId == game_id, GamePlayer.PlayerId == player_id).one().TotalScore
        username = session.query(Player).filter(Player.PlayerId == player_id).one().Username
        emit('playertotalscore'+player_id, {'score': total_score, 'username': username})
    except Exception as e:
        print('Error while getting personal total score '+str(e))


@socketio.on('exercisestarted')
def exercise_started(data):
    join_code = data['joincode']
    print('exercise started' + join_code)
    socketio.emit('exercisestarted' + join_code)


@socketio.on('nextquestion')
def next_question(data):
    join_code = data['joincode']
    print("Next question "+join_code)
    socketio.emit("nextquestion"+join_code)

@socketio.on('totalscore')
def totalscore(data):
    join_code = data['joincode']
    player_id = data['playerid']
    try:
        session = Session()
        game_id = session.query(Game).filter(Game.JoinCode == join_code).one().GameId
        total_score = session.query(GamePlayer).filter(GamePlayer.GameId == game_id, GamePlayer.PlayerId == player_id).one().TotalScore;
        print("Total score: " + str(total_score))
        socketio.emit("totalscore"+player_id, total_score)
        session.close()
    except Exception as e:
        print('Error while getting total score '+str(e))

@socketio.on('gamestopped')
def game_stopped(data):
    join_code = data['joincode']
    print("Game stopped")
    socketio.emit("gamestopped"+join_code)


if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=5500)#, host="0.0.0.0", port=5500, debug=True)