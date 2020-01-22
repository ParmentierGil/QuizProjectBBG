var socket;

//#region FUNCTIONS

//#region GET

//#region show

//#region ListenTo
var nextpage = function(){
    var button = document.querySelector(".button")
    button.addEventListener("click", function(){
        location.href = "quizmaster_vragenscherm.html";
    })
}

//#region init
const init = function() {
    nextpage();
    socket = io('http://localhost:5000');
    socket.on('connect', function() {
        socket.emit('clientconnected', {data: 'I\'m connected!'});
    });
};


document.addEventListener('DOMContentLoaded', function(){
  console.info("Page loaded");
  init();
});
//#endregion
