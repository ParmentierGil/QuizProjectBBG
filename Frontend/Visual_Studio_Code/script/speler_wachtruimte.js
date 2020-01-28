var socket;
var playerId;
var joinCode;
var connectedPlayers = [];

//#region FUNCTIONS

//#region GET

//#region show

const showNewPlayer = function() {
  console.log(connectedPlayers);
  let spelerHTML = '';
  for (let i = 0; i < connectedPlayers.length; i++) {
    spelerHTML += `<div class="rangschikking_list">
    <div class="speler_wachtruimte">${connectedPlayers[i]}</div>
    <div class="hartslag_container">
      <img src="img/Heart.png" class="hartslag_logo2" alt="hartslag" />
      <div class="hartslag_wachtruimte" id="${connectedPlayers[i]}-hartslag">0</div>
    </div>
  </div>`;
  }
  document.querySelector('.flex-wrap').innerHTML = spelerHTML;
  if (connectedPlayers.length == 1) {
    document.querySelector('.rangschikking').innerHTML = connectedPlayers.length + ' speler';
  } else {
    document.querySelector('.rangschikking').innerHTML = connectedPlayers.length + ' spelers';
  }
};

const showHeartrate = function(username, heartrate) {
  const playerField = (document.querySelector(`#${username}-hartslag`).innerHTML = heartrate);
};

//#region ListenTo
var nextpage = function() {
  var button = document.querySelector('.button');
  button.addEventListener('click', function() {
    location.href = 'quizmaster_vragenscherm.html';
    socket.emit('start game', { joincode: joinCode });
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
  socket = io('http://172.30.248.87:5500');
  joinCode = localStorage.getItem('joinCode');
  playerId = localStorage.getItem('playerId');
  console.log('init' + joinCode);
  //   listenToSocket();

  socket.on('connect', function() {
    socket.emit('clientconnected', { data: "I'm connected!" });
  });
  socket.on('game_started_questions' + joinCode, function(data) {
    localStorage.setItem('gameQuestions', JSON.stringify(data));

    console.log(data);
  });
  socket.on('game_started_exercises' + joinCode, function(data) {
    console.log(joinCode);
    localStorage.setItem('gameExercises', JSON.stringify(data));
    console.log(data);
    location.href = 'speler_vragenscherm.html';
  });
  socket.on('newheartrate' + joinCode, function(data) {
    console.log('hartslagtje');
    let heartrate = data.heartrate;
    let username = data.username;
    if (!connectedPlayers.includes(username)) {
      connectedPlayers.push(username);
      showNewPlayer();
    }
    showHeartrate(username, heartrate);
  });

  var questionNumber = 0;
  localStorage.setItem('questionNumber', questionNumber);
};

document.addEventListener('DOMContentLoaded', function() {
  console.info('Page loaded');
  init();
});
//#endregion
