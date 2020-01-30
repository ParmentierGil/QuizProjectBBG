var playerId;
var socket;
var questionNumber;
var score;
var joinCode;
var questionScore;
var username;

const delay = ms => new Promise(res => setTimeout(res, ms));

//#region FUNCTIONS

const isNull = function(x) {
  return x.score != null && x.score != 0;
};

//#region GET

//#region show

const showTopScores = function(scores) {
  let filteredScores = scores.filter(isNull);

  let sortedScores = filteredScores.sort(function(a, b) {
    return a.score - b.score;
  });
  //sortedScores.reverse();

  for (let entry of sortedScores) {
    if (entry.username == username) {
      let position = sortedScores.indexOf(entry) + 1;
      if (position == 1) {
        document.querySelector(".jouw_ranking").innerHTML =
          "Jij bent als 1ste geëindigd!";
      } else {
        document.querySelector(
          ".jouw_ranking"
        ).innerHTML = `Jij bent als ${position}de geëindigd!`;
      }

      if (position <= 3) {
        var clickeffect = new Audio();
        clickeffect.src = "sound/victory.wav";
        clickeffect.play();
      }
    }
  }

  let top3HTML = "";
  for (let i = 0; i < 3; i++) {
    if (sortedScores[i] != undefined) {
      if (i == 0) {
        top3HTML += `<div class="rangschikking_list2 first_place">
        <img src="img/first-place-medal_1f947.png" alt="1st" class="medal" />
        <div class="speler_rangschikking medium_tekst">${sortedScores[i].username}</div>
        <div class="hartslag_container">
          <img src="img/KLOK.png" class="tijd_logo2" alt="hartslag" />
          <div class="tijd_rangschikking">${sortedScores[i].score}</div>
        </div>
      </div>`;
      } else if (i == 1) {
        top3HTML += `<div class="rangschikking_list2 second_place">
        <img src="img/second-place-medal_1f948.png" alt="2nd" class="medal" />
        <div class="speler_rangschikking medium_tekst">${sortedScores[i].username}</div>
        <div class="hartslag_container">
          <img src="img/KLOK.png" class="tijd_logo2" alt="hartslag" />
          <div class="tijd_rangschikking">${sortedScores[i].score}</div>
        </div>
      </div>`;
      } else if (i == 2) {
        top3HTML += `<div class="rangschikking_list2 third_place">
        <img src="img/third-place-medal_1f949.png" alt="3rd" class="medal" />
        <div class="speler_rangschikking medium_tekst">${sortedScores[i].username}</div>
        <div class="hartslag_container">
          <img src="img/KLOK.png" class="tijd_logo2" alt="hartslag" />
          <div class="tijd_rangschikking">${sortedScores[i].score}</div>
        </div>
      </div>`;
      }
    }
  }
  document.querySelector(".rangschikkinglijst").innerHTML = top3HTML;
};

//#region ListenTo

//#region init
const init = function() {
  questionNumber = parseInt(localStorage.getItem("questionNumber"));
  questions = JSON.parse(localStorage.getItem("gameQuestions"));
  joinCode = localStorage.getItem("joinCode");
  playerId = localStorage.getItem("playerId");

  socket = io("http://192.168.1.178:5500");

  socket.emit("mytotalscore", { playerid: playerId, joincode: joinCode });
  socket.emit("alltotalscores", { joincode: joinCode });

  socket.on("playertotalscore" + playerId, function(data) {
    console.log(data);
    username = data.username;
    let score = data.score;
  });

  socket.on("alltotalscores" + joinCode, function(data) {
    console.log(data);
    showTopScores(data);
  });
  socket.on("gamestopped" + joinCode, function() {
    location.href = "global_startpagina.html";
  });
};

document.addEventListener("DOMContentLoaded", function() {
  console.info("Page loaded");
  init();
});
//#endregion
