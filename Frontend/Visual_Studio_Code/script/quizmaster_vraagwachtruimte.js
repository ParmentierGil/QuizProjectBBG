var socket;
var joinCode;
let connectedPlayers = [];
let playerCount;
let playersFinished = [];
let questionCount;
let questions;
var opteller = 0;

//#region FUNCTIONS

var timerfunctie = function() {
  timer = document.querySelector("#tijd");
  interval = setInterval(timeIt, 1000);
  timer.innerhtml = opteller;

  function timeIt() {
    opteller = opteller + 1;
    timer.innerHTML = opteller;
  }
};
//#endregion

//#region GET
//#endregion

//#region show

const showNewPlayer = function() {
  console.log(connectedPlayers);
  let spelerHTML = "";
  for (let i = 0; i < connectedPlayers.length; i++) {
    spelerHTML += `<div class="rangschikking_list">
    <div class="speler_wachtruimte">${connectedPlayers[i]}</div>
    <div class="hartslag_container">
        <img src="img/Heart.png" class="hartslag_logo2" alt="hartslag">
        <div class="hartslag_wachtruimte" id="${connectedPlayers[i]}-hartslag">0</div>
    </div>
</div>`;
  }
  document.querySelector(".flex-wrap").innerHTML = spelerHTML;
};

const showHeartrate = function(username, heartrate) {
  const playerField = (document.querySelector(
    `#${username}-hartslag`
  ).innerHTML = heartrate);
};
//#endregion

//#region ListenTo

const listenToStopGame = function() {
  var button = document.querySelector("#stop");
  button.addEventListener("click", function() {
    document.querySelector(".stopspel").style.display = "block";
    listenToConfirmation();
  });
};

const listenToConfirmation = function() {
  document.querySelector(".stopknopja").addEventListener("click", function() {
    socket.emit("gamestopped", { joincode: joinCode });
    location.href = "global_startpagina.html";
  });
  document.querySelector(".stopknopnee").addEventListener("click", function() {
    document.querySelector(".stopspel").style.display = "none";
  });
};
//#endregion

//#region init
const init = function() {
  socket = io("http://192.168.1.178:5500");

  joinCode = localStorage.getItem("joinCode");
  playerCount = localStorage.getItem("playerCount");
  questionNumber = parseInt(localStorage.getItem("questionNumber"));
  questions = JSON.parse(localStorage.getItem("gameQuestions"));

  socket.on("newheartrate" + joinCode, function(data) {
    console.log("hartslagtje");
    let heartrate = data.heartrate;
    let username = data.username;
    if (!connectedPlayers.includes(username)) {
      connectedPlayers.push(username);
      showNewPlayer();
    }
    showHeartrate(username, heartrate);
  });

  socket.on("alltotalscores" + joinCode, function(data) {
    if (!playersFinished.includes(data.username)) {
      playersFinished.push(data.username);
    }
    console.log(
      "Playercount: " +
        playerCount +
        "FinishedPlayers: " +
        playersFinished.length
    );
    if (playersFinished.length == playerCount) {
      if (questionNumber + 1 == questions.length) {
        location.href = "quizmaster_eindscore.html";
        console.log("QC: " + questionNumber + "QL: " + questions.length);
      } else {
        location.href = "quizmaster_rangschikking_scherm.html";
        console.log("QC: " + questionNumber + "QL: " + questions.length);
      }
    }
  });
  listenToStopGame();
  timerfunctie();
};

document.addEventListener("DOMContentLoaded", function() {
  console.info("Page loaded");
  init();
});
//#endregion
