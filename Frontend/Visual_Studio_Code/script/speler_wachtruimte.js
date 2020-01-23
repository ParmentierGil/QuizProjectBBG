var socket;
var playerId = 'be5e2892-c170-472e-8bab-cafc3bfa1746';

//#region FUNCTIONS

//#region GET

//#region show

//#region ListenTo
var nextpage = function() {
  var button = document.querySelector('.button');
  button.addEventListener('click', function() {
    location.href = 'quizmaster_vragenscherm.html';
    socket.emit('start game', { 'join code': 'KBIS' });
  });
};

//#endregion

//#region ListenToSocket
var listenToSocket = function() {
  socket.on('game started', function(QA) {
    console.log(QA);
  });
};

//#region init

const init = function() {
  //   nextpage();
  socket = io('http://172.30.248.71:5500');
  //   listenToSocket();

  socket.on('connect', function() {
    socket.emit('clientconnected', { data: "I'm connected!" });
  });
  socket.on('game_started_questions', function(data) {
    localStorage.setItem('gameQuestions', JSON.stringify(data));

    console.log(data);
  });
  socket.on('game_started_exercises', function(data) {
    localStorage.setItem('gameExercises', JSON.stringify(data));

    console.log(data);
  });
  socket.on('newheartrate' + playerId, function(data) {
    console.log(data);
  });
};

document.addEventListener('DOMContentLoaded', function() {
  console.info('Page loaded');
  init();
});
//#endregion
