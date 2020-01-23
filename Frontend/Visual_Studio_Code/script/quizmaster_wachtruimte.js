var socket;

//#region FUNCTIONS
//#endregion

//#region GET
//#endregion

//#region show
//#endregion

//#region ListenTo
var nextpage = function() {
  var button = document.querySelector(".button");
  button.addEventListener("click", function() {
    //location.href = "quizmaster_vragenscherm.html";
    socket.emit("startgame", { "join code": "KBIS" });
  });
};

let listenToSocket = function() {
  socket.on("game started", function(json) {
    console.log(json);
  });
};
//#endregion

//#region init
const init = function() {
  nextpage();
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
