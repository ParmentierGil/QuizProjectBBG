var playerId;
var socket;
var questionNumber;

//#region FUNCTIONS

//#region GET

var getNumberQuestion = function() {
  questions = JSON.parse(localStorage.getItem('gameQuestions'));
  number = questionNumber;
  console.log(number);
  numberweergave = document.getElementById('questionCount');
  numberweergave.innerHTML = 'Vraag ' + parseInt(number + 1) + 'van de' questions.length;
};
var getGameQuestions = function() {
  questions = JSON.parse(localStorage.getItem('gameQuestions'))[questionNumber].QuestionText;
  console.log(questions);
  questionweergave = document.getElementById('gameQuestion');
  questionweergave.innerHTML = questions;
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

  timerfunctie();
  getGameQuestions();
  getNumberQuestion();
};

document.addEventListener('DOMContentLoaded', function() {
  console.info('Page loaded');
  init();
});
//#endregion
