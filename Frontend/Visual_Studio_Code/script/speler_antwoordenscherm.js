var playerId;
var socket;
var questionNumber;
var questions;
var joinCode;
var timer;
var requiredHeartrate;
var interval;
var vraagScore;
var totalScore;

const delay = ms => new Promise(res => setTimeout(res, ms));

//#region FUNCTIONS
const timeranimation = function() {
  var tijd = document.querySelector(".tijd");
  tijd.style.animation = "0s linear 3s change-content";
};

//#region GET

//#region show
var showAntwoorden = function() {
  var opties = document.querySelectorAll(".antwoord");
  var randomIndex = Math.floor(Math.random() * 4);
  var juistAntwoord = questions[questionNumber].CorrectAnswer;
  opties[randomIndex].innerHTML = juistAntwoord;
  opties[randomIndex].parentElement.classList.add("juist");

  document.querySelector(`.juist_animation${randomIndex}`).id =
    "juist_antwoord";

  var fouteAntwoorden = [];
  fouteAntwoorden.push(questions[questionNumber].WrongAnswer1);
  fouteAntwoorden.push(questions[questionNumber].WrongAnswer2);
  fouteAntwoorden.push(questions[questionNumber].WrongAnswer3);
  let foutIndex = 0;
  for (let i = 0; i < 4; i++) {
    if (i != randomIndex) {
      document.querySelector(
        `.fout_animation${i}`
      ).id = `fout_antwoord${foutIndex}`;
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
const soundEffect = function() {
  var clickeffect = new Audio();
  clickeffect.src = "sound/correct.mp3";
  clickeffect.play();
  // var naam = document.getElementById('sound');
  // naam.addEventListener('click', function() {
  //   clickeffect.play();
  // });
};

const soundEffectIncorrect = function() {
  var clickeffect = new Audio();
  clickeffect.src = "sound/incorrect.mp3";
  clickeffect.play();
  // var naam = document.getElementById('sound');
  // naam.addEventListener('click', function() {
  //   clickeffect.play();
  // });
};

var timerfunctie = function() {
  timer = document.querySelector("#tijd");
  interval = setInterval(timeIt, 1000);
  timer.innerhtml = totalScore;

  function timeIt() {
    vraagScore++;
    totalScore++;
    timer.innerHTML = totalScore;
  }
};

const listenToCorrectAnswer = function() {
  let correctAnswer = document.querySelector(".juist");
  correctAnswer.addEventListener("click", function() {
    clearInterval(interval);
    document.querySelector("#juist_antwoord").style.display = "block";
    socket.emit("answeredcorrectly", {
      playerid: playerId,
      joincode: joinCode,
      questionid: questions[questionNumber].QuestionId,
      score: vraagScore
    });
    localStorage.setItem("questionScore", vraagScore);
    soundEffect();
  });
};

const listenToWrongAnswer = function() {
  var fout1 = document.querySelector(".fout1");
  var fout2 = document.querySelector(".fout2");
  var fout3 = document.querySelector(".fout3");
  // var kruis1 = document.querySelector(".kruis1");
  // var kruis2 = document.querySelector(".kruis2");
  // var kruis3 = document.querySelector(".kruis3");
  var straftijd = document.querySelector(".straftijd");

  fout1.addEventListener("click", async function() {
    document.querySelector("#fout_antwoord0").style.display = "block";
    timeranimation();
    straftijd.style.display = "block";
    soundEffectIncorrect();
    await delay(2000);
    straftijd.style.display = "none";
    totalScore = totalScore + 10;
    vraagScore = vraagScore + 10;
    timer.innerHTML = totalScore;
  });

  fout2.addEventListener("click", async function() {
    document.querySelector("#fout_antwoord1").style.display = "block";
    timeranimation();
    straftijd.style.display = "block";
    soundEffectIncorrect();
    await delay(2000);
    straftijd.style.display = "none";
    totalScore = totalScore + 10;
    vraagScore = vraagScore + 10;
    timer.innerHTML = totalScore;
  });

  fout3.addEventListener("click", async function() {
    document.querySelector("#fout_antwoord2").style.display = "block";
    timeranimation();
    straftijd.style.display = "block";
    soundEffectIncorrect();
    await delay(2000);
    straftijd.style.display = "none";
    totalScore = totalScore + 10;
    vraagScore = vraagScore + 10;
    timer.innerHTML = totalScore;
  });
};

//#region init
const init = function() {
  questionNumber = parseInt(localStorage.getItem("questionNumber"));
  questions = JSON.parse(localStorage.getItem("gameQuestions"));
  playerId = localStorage.getItem("playerId");
  joinCode = localStorage.getItem("joinCode");
  requiredHeartrate = localStorage.getItem("requiredHeartrate");
  vraagScore = 0;

  showGameQuestions();
  showNumberQuestion();
  showAntwoorden();
  showRequiredHeartrate();

  socket = io("http://192.168.1.178:5500");

  socket.emit("totalscore", { joincode: joinCode, playerid: playerId });

  socket.on("newheartrate" + playerId, function(heartrate) {
    document.querySelector(".live_heartbeat").innerHTML = heartrate;
    if (parseInt(heartrate) >= 60) {
      document.querySelector(".wazig").style.filter = "blur(0px)";
      document.querySelector(".heartbeat_lottie").style.display = "none";
    }
  });

  socket.on("totalscore" + playerId, function(data) {
    console.log(data);
    totalScore = parseInt(data);
    timerfunctie();
  });

  socket.on("scoresaved" + playerId, async function() {
    await delay(1500);
    if (questionNumber + 1 == questions.length) {
      location.href = "speler_eindscore.html";
      console.log("QC: " + questionNumber + "QL: " + questions.length);
    } else {
      location.href = "speler_rangschikking_scherm.html";
      console.log("QC: " + questionNumber + "QL: " + questions.length);
    }
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
