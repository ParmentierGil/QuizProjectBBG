var socket;

var playerId;

//#region FUNCTIONS

//#region GET

//#region show
const delay = ms => new Promise(res => setTimeout(res, ms));

//#region ListenTo
var alertfunctie = function() {
  var input = document.querySelector('.inputColor2');
  var submit = document.querySelector('.buttonCodeScreen');
  var alert = document.querySelector('.alert');

  submit.addEventListener('click', async function() {
    valid = true;

    if (input.value == '') {
      alert.style.display = 'block';
      valid = false;
      await delay(3000);
      alert.style.display = 'none';
    } else {
      socket.emit('makeplayer', { username: input.value });
    }

    return valid;
  });
};
//#region init
const init = function() {
  alertfunctie();
  socket = io('http://172.30.248.71:5500');

  socket.on('connect', function() {
    socket.emit('clientconnected', { data: "I'm connected!" });
  });
  socket.on('playerid', function(data) {
    console.log(data);
    localStorage.setItem('playerId', data);
    location.href = 'speler_spelcode.html';
  });
};

document.addEventListener('DOMContentLoaded', function() {
  console.info('Page loaded');
  init();
});
//#endregion
