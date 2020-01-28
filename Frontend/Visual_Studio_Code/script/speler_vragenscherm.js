var socket;
var playerId;
var questionNumber;

//#region FUNCTIONS

//#region GET

var getNumberQuestion = function() {
  number = questionNumber;
  console.log(number);
  numberweergave = document.getElementById("questionCount");
  numberweergave.innerHTML = "Vraag " + parseInt(number + 1);
};

var getGameQuestions = function() {
  questions = JSON.parse(localStorage.getItem("gameQuestions"))[questionNumber]
    .QuestionText;
  console.log(questions);
  questionweergave = document.getElementById("gameQuestion");
  questionweergave.innerHTML = questions;
};

var getSportExercise = function() {
  exercise = JSON.parse(localStorage.getItem("gameExercises"))[questionNumber]
    .Description;
  console.log(exercise);
  exerciseweergave = document.getElementById("gameExercise");
  exerciseweergave.innerHTML = exercise;
};

//#region show

//#region ListenTo
var nextpage = function() {
  var button = document.querySelector(".button");
  button.addEventListener("click", function() {
    location.href = "quizmaster_vragenscherm.html";
    socket.emit("start game", { "join code": "KBIS" });
  });
};

//#endregion

//#region ListenToSocket
var listenToSocket = function() {
  socket.on("game started", function(QA) {
    console.log(QA);
  });
};

//#region init

const init = function() {
  questionNumber = parseInt(localStorage.getItem("questionNumber"));
  playerId = localStorage.getItem("playerId");
  //   console.log(questionNumber);
  getNumberQuestion();
  getSportExercise();

  getGameQuestions();
  //   nextpage();
  socket = io("http://172.30.248.87:5500");
  //   listenToSocket();

  socket.on("connect", function() {
    socket.emit("clientconnected", { data: "I'm connected!" });
  });
  socket.on("newheartrate" + playerId, function(data) {
    document.querySelector("#live_hartslag").innerHTML = data;
  });
};

document.addEventListener("DOMContentLoaded", function() {
  console.info("Page loaded");
  init();
});
//#endregion
