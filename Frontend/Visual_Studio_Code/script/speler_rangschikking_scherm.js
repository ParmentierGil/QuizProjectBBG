var playerId;
var socket;
var questionNumber;
var score;
var joinCode;
var questionScore;

const delay = ms => new Promise(res => setTimeout(res, ms));

//#region FUNCTIONS
const soundEffect = function() {
  var clickeffect = new Audio();
  clickeffect.src = 'select.mp3';
  var naam = document.getElementById('sound');
  naam.addEventListener('click', function() {
    clickeffect.play();
  });
};

const isNull = function(x) {
  return x.score != null && x.score != 0;
};

//#region GET

//#region show

const showQuestionScore = function() {
  document.querySelector('#vraagscore').innerHTML = questionScore;
};

const showTopScores = function(scores) {
  let filteredScores = scores.filter(isNull);
  console.log(filteredScores);

  let sortedScores = filteredScores.sort(function(a, b) {
    return a.score - b.score;
  });
  //sortedScores.reverse();

  let top3HTML = '';
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
  document.querySelector('.rangschikkinglijst').innerHTML = top3HTML;
};

//#region ListenTo

//#region init
const init = function() {
  questionNumber = parseInt(localStorage.getItem('questionNumber'));
  playerId = localStorage.getItem('playerId');
  joinCode = localStorage.getItem('joinCode');
  requiredHeartrate = localStorage.getItem('requiredHeartrate');
  questionScore = localStorage.getItem('questionScore');
  soundEffect();

  showQuestionScore();

  socket = io('http://172.30.248.87:5500');

  socket.emit('alltotalscores', { joincode: joinCode });

  socket.on('newheartrate' + playerId, function(heartrate) {
    document.querySelector('#live_hartslag').innerHTML = heartrate;
  });

  socket.on('alltotalscores' + joinCode, function(data) {
    console.log(data);
    showTopScores(data);
  });
};

document.addEventListener('DOMContentLoaded', function() {
  console.info('Page loaded');
  init();
});
//#endregion
