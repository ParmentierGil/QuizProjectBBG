var playerId;
var socket;
var questionNumber;
var questions;

//#region FUNCTIONS

//#region GET
var getAntwoorden = function() {
  var opties = document.querySelectorAll('.optie');
  var randomIndex = Math.floor(Math.random() * 4);
  var juistAntwoord = questions[questionNumber].CorrectAnswer;
  opties[randomIndex].innerHTML = juistAntwoord;
  var fouteAntwoorden = [];
  fouteAntwoorden.push(questions[questionNumber].WrongAnswer1);
  fouteAntwoorden.push(questions[questionNumber].WrongAnswer2);
  fouteAntwoorden.push(questions[questionNumber].WrongAnswer3);
  for (let i = 0; i < 4; i++) {
    if (i != randomIndex) {
      if (i == 3) {
        opties[i].innerHTML = fouteAntwoorden[2];
      } else {
        opties[i].innerHTML = fouteAntwoorden[i];
      }
    }
  }
};

var getNumberQuestion = function() {
  number = questionNumber;
  console.log(number);
  numberweergave = document.getElementById('questionCount');
  numberweergave.innerHTML = 'Vraag ' + parseInt(number + 1) + ' van de ' + questions.length;
};
var getGameQuestions = function() {
  var questiontext = questions[questionNumber].QuestionText;
  console.log(questiontext);
  questionweergave = document.getElementById('gameQuestion');
  questionweergave.innerHTML = questiontext;
};
//#region show
const delay = ms => new Promise(res => setTimeout(res, ms));

//#region ListenTo
var timerfunctie = function() {
  var timer = document.querySelector('#tijd');
  var counter = 0;
  var interval = setInterval(timeIt, 1000);
  timer.innerhtml = counter;

  function timeIt() {
    counter++;
    timer.innerHTML = counter;
  }

  var fout1 = document.querySelector('.fout1');
  var fout2 = document.querySelector('.fout2');
  var fout3 = document.querySelector('.fout3');
  var kruis1 = document.querySelector('.kruis1');
  var kruis2 = document.querySelector('.kruis2');
  var kruis3 = document.querySelector('.kruis3');
  var juist = document.querySelector('.juist');
  var vinkje = document.querySelector('.vinkje');
  var straftijd = document.querySelector('.straftijd');

  fout1.addEventListener('click', async function() {
    straftijd.style.display = 'block';
    counter = counter + 10;
    timer.innerHTML = counter;
    kruis1.style.display = 'flex';
    await delay(2000);
    kruis1.style.display = 'none';
  });

  fout2.addEventListener('click', async function() {
    counter = counter + 10;
    timer.innerHTML = counter;
    kruis2.style.display = 'flex';
    await delay(2000);
    kruis2.style.display = 'none';
  });

  fout3.addEventListener('click', async function() {
    counter = counter + 10;
    timer.innerHTML = counter;
    kruis3.style.display = 'flex';
    await delay(2000);
    kruis3.style.display = 'none';
  });

  juist.addEventListener('click', async function() {
    var score = timer;
    clearInterval(interval);
    vinkje.style.display = 'flex';
    await delay(3000);
    location.href = 'speler_rangschikking_scherm.html';
  });
};

//#region init
const init = function() {
  questionNumber = parseInt(localStorage.getItem('questionNumber'));
  questions = JSON.parse(localStorage.getItem('gameQuestions'));
  playerId = localStorage.getItem('playerId');

  timerfunctie();
  getGameQuestions();
  getNumberQuestion();
  getAntwoorden();

  socket = io('http://172.30.248.93:5500');
  //   listenToSocket();

  socket.on('connect', function() {
    socket.emit('clientconnected', { data: "I'm connected!" });
  });
  socket.on('newheartrate' + playerId, function(data) {
    console.log(data);
    document.getElementById('hartslag').innerHTML = data;
  });
};

document.addEventListener('DOMContentLoaded', function() {
  console.info('Page loaded');
  init();
});
//#endregion
