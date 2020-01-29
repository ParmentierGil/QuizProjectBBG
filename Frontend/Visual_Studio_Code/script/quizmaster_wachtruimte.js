var socket;
var joinCode;
let connectedPlayers = [];

//#region FUNCTIONS
//#endregion

//#region GET
//#endregion

//#region show

const showJoinCode = function() {
  document.querySelector("#spelcode").innerHTML = "Spelcode:  " + joinCode;
};

const showPlayers = function() {
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

const listenToStartGame = function() {
  let startButton = document
    .querySelector("#startbutton")
    .addEventListener("click", function() {
      socket.emit("startgame", { joincode: joinCode });
      localStorage.setItem("playerCount", connectedPlayers.length);
    });
};

//#endregion

//#region init
const init = function() {
  socket = io("http://192.168.1.178:5500");

  socket.on("connect", function() {
    socket.emit("clientconnected", { data: "I'm connected!" });
  });

  joinCode = localStorage.getItem("joinCode");
  showJoinCode();

  console.log("listening on   joinCodeCorrect" + joinCode);
  socket.on("joinCodeCorrect" + joinCode, function(username) {
    console.log("joincodecorrect");
    console.log(username);
    if (!connectedPlayers.includes(username)) {
      connectedPlayers.push(username);
      showPlayers();
    }
  });

  socket.on("newheartrate" + joinCode, function(data) {
    console.log("hartslagtje");
    let heartrate = data.heartrate;
    let username = data.username;
    showHeartrate(username, heartrate);
  });

  socket.on("game_started_questions" + joinCode, function(data) {
    localStorage.setItem("questions", JSON.stringify(data));
    console.log(data);
  });

  socket.on("game_started_exercises" + joinCode, function(data) {
    localStorage.setItem("exercises", JSON.stringify(data));
    location.href = "quizmaster_vragenscherm.html";
  });

  listenToStartGame();
};

document.addEventListener("DOMContentLoaded", function() {
  console.info("Page loaded");
  init();
});
//#endregion
