var socket;
var joinCode;
let connectedPlayers = [];
let playerCount;
let playersFinished = [];

//#region FUNCTIONS
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
    location.href = "global_startpagina.html";
  });
};

//#endregion

//#region init
const init = function() {
  socket = io("http://192.168.1.178:5500");

  joinCode = localStorage.getItem("joinCode");
  playerCount = localStorage.getItem("playerCount");

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
      location.href = "quizmaster_rangschikking_scherm.html";
    }
  });
  listenToStopGame();
};

document.addEventListener("DOMContentLoaded", function() {
  console.info("Page loaded");
  init();
});
//#endregion
