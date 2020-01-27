var socket;

//#region FUNCTIONS

//#region GET

//#region show

//#region ListenTo
var listenToNextPage = function() {
  var button = document.querySelector(".button");
  button.addEventListener("click", function() {
    //location.href = "quizmaster_vragenscherm.html";
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
  socket = io("http://172.30.248.71:5500");
  listenToSocket();

  socket.on("connect", function() {
    socket.emit("clientconnected", { data: "I'm connected!" });
  });
};

document.addEventListener("DOMContentLoaded", function() {
  console.info("Page loaded");
  init();
});
//#endregion
