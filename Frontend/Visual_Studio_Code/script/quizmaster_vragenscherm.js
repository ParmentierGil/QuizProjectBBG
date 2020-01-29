var socket;
var playerId;
var questions;
var questionNumber;
var requiredHeartrate;

//#region FUNCTIONS

//#region GET

var showNumberQuestionOf = function() {
  number = questionNumber;
  console.log(number);
  numberweergave = document.getElementById("questionCountOf");
  numberweergave.innerHTML =
    "Vraag " + parseInt(number + 1) + " van de " + questions.length;
};

var showNumberQuestion = function() {
  number = questionNumber;
  console.log(number);
  numberweergave = document.getElementById("questionCount");
  numberweergave.innerHTML = "Vraag " + parseInt(number + 1);
};

var showGameQuestion = function() {
  console.log(questions);
  questionweergave = document.getElementById("gameQuestion");
  questionweergave.innerHTML = questions[questionNumber].QuestionText;
};

var showSportExercise = function() {
  console.log(exercise);
  exerciseweergave = document.getElementById("gameExercise");
  exerciseweergave.innerHTML = exercise;
};

//#region show

//#region ListenTo
var listenToStartExercise = function() {
  var button = document.querySelector("#Volgende");
  button.addEventListener("click", function() {
    socket.emit("exercisestarted", { joincode: joinCode });
    location.href = "quizmaster_vraagwachtruimte.html";
  });
};

const listenToStopGame = function() {
  var button = document.querySelector("#stop");
  button.addEventListener("click", function() {
    location.href = "global_startpagina.html";
  });
};

//#endregion

//#region ListenToSocket

//#region init

const init = function() {
  socket = io("http://192.168.1.178:5500");

  joinCode = localStorage.getItem("joinCode");
  questionNumber = parseInt(localStorage.getItem("questionNumber"));
  playerId = localStorage.getItem("playerId");

  questions = JSON.parse(localStorage.getItem("gameQuestions"));
  exercise = JSON.parse(localStorage.getItem("gameExercises"))[questionNumber]
    .Description;

  showNumberQuestionOf();
  showNumberQuestion();
  showSportExercise();
  showGameQuestion();

  listenToStartExercise();
  listenToStopGame();
};

document.addEventListener("DOMContentLoaded", function() {
  console.info("Page loaded");
  init();
});
//#endregion
