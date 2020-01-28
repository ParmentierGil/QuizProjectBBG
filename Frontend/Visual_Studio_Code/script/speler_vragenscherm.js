var socket;
var playerId;
var questions;
var questionNumber;
var requiredHeartrate;

//#region FUNCTIONS

//#region GET

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

const showRequiredHeartrate = function() {
  document.querySelector("#requiredheartrate").innerHTML = requiredHeartrate;
};

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
  socket = io("http://172.30.248.87:5500");

  joinCode = localStorage.getItem("joinCode");
  questionNumber = parseInt(localStorage.getItem("questionNumber"));
  playerId = localStorage.getItem("playerId");

  questions = JSON.parse(localStorage.getItem("gameQuestions"));
  exercise = JSON.parse(localStorage.getItem("gameExercises"))[questionNumber]
    .Description;

  socket.emit("requiredheartrate", {
    joincode: joinCode,
    playerid: playerId,
    questionnumber: questionNumber,
    questioncount: questions.length
  });

  socket.on("requiredheartrate" + playerId, function(requiredheartrate) {
    requiredHeartrate = requiredheartrate;
    localStorage.setItem("requiredHeartrate", requiredheartrate);
    showRequiredHeartrate();
  });

  showNumberQuestion();
  showSportExercise();
  showGameQuestion();

  socket.on("newheartrate" + playerId, function(data) {
    document.querySelector("#live_hartslag").innerHTML = data;
  });
};

document.addEventListener("DOMContentLoaded", function() {
  console.info("Page loaded");
  init();
});
//#endregion
