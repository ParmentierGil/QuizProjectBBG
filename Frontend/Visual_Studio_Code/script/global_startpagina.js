const delay = ms => new Promise(res => setTimeout(res, ms));

const soundEffect = function() {
  var clickeffect = new Audio();
  clickeffect.src = 'select.mp3';
  var naam = document.getElementById('sound');
  naam.addEventListener('click', function() {
    clickeffect.play();
    setTimeout(function() {
      location.href = 'speler_chooseName.html';
    }, 750);
  });
};

const init = function() {
  soundEffect();
};

document.addEventListener('DOMContentLoaded', function() {
  console.info('Page loaded');
  init();
});
