var playerId;
var socket;

//#region FUNCTIONS

//#region GET

//#region show
const delay = ms => new Promise(res => setTimeout(res, ms));

//#region ListenTo
var alertfunctie = function() {
  var input = document.querySelector('.inputColor');
  var submit = document.querySelector('.buttonCodeScreen');
  var alert = document.querySelector('.alert');

  submit.addEventListener('click', async function() {
    // valid = true;

    if (input.value == '') {
      alert.innerHTML = 'Geef een code in';
      // valid = false;
      await delay(3000);
      alert.innerHTML = '';
    } else if (input.value.length != 4) {
      alert.innerHTML = 'Ongeldige code';
      // valid = false;
      await delay(3000);
      alert.innerHTML = '';
    } else {
      location.href = 'speler_wachtruimte.html';
    }

    // return valid;
  });
};

//#region init
const init = function() {
  alertfunctie();
  playerId = localStorage.getItem('playerId');
  console.log(playerId);
};

document.addEventListener('DOMContentLoaded', function() {
  console.info('Page loaded');
  init();
});
//#endregion
