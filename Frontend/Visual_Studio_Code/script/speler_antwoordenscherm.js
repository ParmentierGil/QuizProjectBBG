var playerId;
var socket;
var questionNumber;
var questions;
var score;
var joinCode;
var timer;
var requiredHeartrate;

const delay = ms => new Promise(res => setTimeout(res, ms));

//#region FUNCTIONS
const timeranimation = function(){
  var tijd = document.querySelector(".tijd")
  tijd.style.animation = "0s linear 3s change-content";
}

//#region GET

//#region show
var showAntwoorden = function() {
  var opties = document.querySelectorAll(".antwoord");
  var randomIndex = Math.floor(Math.random() * 4);
  var juistAntwoord = questions[questionNumber].CorrectAnswer;
  opties[randomIndex].innerHTML = juistAntwoord;
  opties[randomIndex].parentElement.classList.add("juist");
  var fouteAntwoorden = [];
  fouteAntwoorden.push(questions[questionNumber].WrongAnswer1);
  fouteAntwoorden.push(questions[questionNumber].WrongAnswer2);
  fouteAntwoorden.push(questions[questionNumber].WrongAnswer3);
  let foutIndex = 0;
  for (let i = 0; i < 4; i++) {
    if (i != randomIndex) {
      opties[i].innerHTML = fouteAntwoorden[foutIndex];
      opties[i].parentElement.classList.add("fout" + (foutIndex + 1));
      foutIndex++;
    }
  }
  listenToCorrectAnswer();
  listenToWrongAnswer();
};

var showNumberQuestion = function() {
  number = questionNumber;
  console.log(number);
  numberweergave = document.getElementById("questionCount");
  numberweergave.innerHTML =
    "Vraag " + parseInt(number + 1) + " van de " + questions.length;
};
var showGameQuestions = function() {
  var questiontext = questions[questionNumber].QuestionText;
  console.log(questiontext);
  questionweergave = document.querySelector(".vraag");
  questionweergave.innerHTML = questiontext;
};

const showRequiredHeartrate = function() {
  document.querySelector("#requiredheartrate").innerHTML = requiredHeartrate;
};

//#region ListenTo
var timerfunctie = function() {
  timer = document.querySelector("#tijd");
  score = 0;
  var interval = setInterval(timeIt, 1000);
  timer.innerhtml = score;

  function timeIt() {
    score++;
    timer.innerHTML = score;
  }
};

const listenToCorrectAnswer = function() {
  let correctAnswer = document.querySelector(".juist");
  correctAnswer.addEventListener("click", function() {
    socket.emit("answeredcorrectly", {
      playerid: playerId,
      joincode: joinCode,
      questionid: questions[questionNumber].QuestionId,
      score: score
    });
    localStorage.setItem("questionScore", score);
  });
};

const listenToWrongAnswer = function() {
  var fout1 = document.querySelector(".fout1");
  var fout2 = document.querySelector(".fout2");
  var fout3 = document.querySelector(".fout3");
  var kruis1 = document.querySelector(".kruis1");
  var kruis2 = document.querySelector(".kruis2");
  var kruis3 = document.querySelector(".kruis3");
  var straftijd = document.querySelector(".straftijd");

  fout1.addEventListener("click", async function() {
    timeranimation();
    straftijd.style.display = "block";
    await delay(2000);
    straftijd.style.display = "none";
    score = score + 10;
    timer.innerHTML = score;
  });

  fout2.addEventListener("click", async function() {
    timeranimation();
    straftijd.style.display = "block";
    await delay(2000);
    straftijd.style.display = "none";
    score = score + 10;
    timer.innerHTML = score;
  });

  fout3.addEventListener("click", async function() {
    timeranimation();
    straftijd.style.display = "block";
    await delay(2000);
    straftijd.style.display = "none";
    score = score + 10;
    timer.innerHTML = score;
  });
};

//#region init
const init = function() {
  questionNumber = parseInt(localStorage.getItem("questionNumber"));
  questions = JSON.parse(localStorage.getItem("gameQuestions"));
  playerId = localStorage.getItem("playerId");
  joinCode = localStorage.getItem("joinCode");
  requiredHeartrate = localStorage.getItem("requiredHeartrate");

  timerfunctie();
  showGameQuestions();
  showNumberQuestion();
  showAntwoorden();
  showRequiredHeartrate();

  socket = io("http://172.30.248.87:5500");
  //   listenToSocket();

  socket.on("newheartrate" + playerId, function(heartrate) {
    document.querySelector(".live_heartbeat").innerHTML = heartrate;
    if (parseInt(heartrate) > 0) {
      document.querySelector(".wazig").style.filter = "blur(0px)";
      document.querySelector(".heartbeat_lottie").style.display = "none";
    }
  });
  socket.on("scoresaved" + playerId, function() {
    location.href = "speler_rangschikking_scherm.html";
  });
};

document.addEventListener("DOMContentLoaded", function() {
  console.info("Page loaded");
  init();
});
//#endregion
