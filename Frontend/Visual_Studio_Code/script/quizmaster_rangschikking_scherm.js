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

var showNumberQuestionOf = function() {
  number = questionNumber;
  console.log(number);
  numberweergave = document.getElementById("questionCountOf");
  numberweergave.innerHTML =
    "Vraag " + parseInt(number + 1) + " van de " + questions.length;
};

const showTopScores = function(scores) {
  let filteredScores = scores.filter(isNull);

  let sortedScores = filteredScores.sort(function(a, b) {
    return a.score - b.score;
  });
  //sortedScores.reverse();

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

const listenToNextQuestion = function() {
  document
    .querySelector("#volgendevraag")
    .addEventListener("click", function() {
      socket.emit("nextquestion", { joincode: joinCode });
      questionNumber += 1;
      localStorage.setItem("questionNumber", questionNumber);
      location.href = "quizmaster_vragenscherm.html";
    });
};

const listenToStopGame = function() {
  var button = document.querySelector("#stop");
  button.addEventListener("click", function() {
    location.href = "global_startpagina.html";
  });
};

//#region init
const init = function() {
  questionNumber = parseInt(localStorage.getItem("questionNumber"));
  questions = JSON.parse(localStorage.getItem("gameQuestions"));
  joinCode = localStorage.getItem("joinCode");

  socket = io("http://172.30.248.102:5500");

  socket.emit("alltotalscores", { joincode: joinCode });

  socket.on("alltotalscores" + joinCode, function(data) {
    console.log(data);
    showTopScores(data);
  });
  listenToStopGame();
  listenToNextQuestion();
  showNumberQuestionOf();
};

document.addEventListener("DOMContentLoaded", function() {
  console.info("Page loaded");
  init();
});
//#endregion
