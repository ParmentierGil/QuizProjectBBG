//#region FUNCTIONS

//#region GET

//#region show

//#region ListenTo
var nextpage = function() {
  var button = document.querySelector('.button');
  button.addEventListener('click', function() {
    location.href = 'global_eindscore.html';
  });
};

//#region init
const init = function() {
  nextpage();
};

document.addEventListener('DOMContentLoaded', function() {
  console.info('Page loaded');
  init();
});
//#endregion
