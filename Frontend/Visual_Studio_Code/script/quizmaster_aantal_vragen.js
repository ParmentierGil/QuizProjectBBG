var socket;

//#region FUNCTIONS

//#region GET

//#region show
const delay = ms => new Promise(res => setTimeout(res, ms));

//#region ListenTo
var listenToMakeGameButton = function() {
  var input = document.querySelector("#aantal_vragen");
  var submit = document.querySelector(".buttonCodeScreen");
  var alert = document.querySelector(".alert");

  submit.addEventListener("click", async function() {
    if (input.value == "") {
      alert.innerHTML = "Geef het aantal vragen op";
      await delay(3000);
      alert.innerHTML = "";
    } else {
      socket.emit("makegame", { questioncount: input.value });
    }
  });
};

//#region init
const init = function() {
  socket = io("http://192.168.1.178:5500");
  listenToMakeGameButton();
  socket.on("connect", function() {
    socket.emit("clientconnected", { data: "I'm connected!" });
  });
  socket.on("gamemade", function(joincode) {
    console.log(joincode);
    localStorage.setItem("joinCode", joincode);
    localStorage.setItem("questionNumber", 0);
    location.href = "quizmaster_wachtruimte.html";
  });
};

document.addEventListener("DOMContentLoaded", function() {
  console.info("Page loaded");
  init();
});
//#endregion
