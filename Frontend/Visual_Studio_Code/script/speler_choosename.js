var socket;

var playerId;

//#region FUNCTIONS

//#region GET

//#region show
const delay = ms => new Promise(res => setTimeout(res, ms));

//#region ListenTo

var alertfunctie = function() {
  var input = document.querySelector(".inputColor2");
  var submit = document.querySelector(".buttonCodeScreen");
  var alert = document.querySelector(".alert");

  submit.addEventListener("click", async function() {
    if (input.value == "") {
      alert.innerHTML = "Vul je naam in";
      await delay(3000);
      alert.innerHTML = "";
    } else if (!/^[a-zA-Z]+$/.test(input.value)) {
      alert.innerHTML = "Gebruik enkel letters in je naam.";
      await delay(3000);
      alert.innerHTML = "";
    } else {
      socket.emit("makeplayer", { username: input.value });
    }
  });
};
//#region init
const init = function() {
  socket = io("http://172.30.248.102:5500");

  socket.on("connect", function() {
    socket.emit("clientconnected", { data: "I'm connected!" });
  });
  socket.on("playerid", function(data) {
    console.log(data);
    localStorage.setItem("playerId", data);
    location.href = "speler_spelcode.html";
  });
  alertfunctie();
};

document.addEventListener("DOMContentLoaded", function() {
  console.info("Page loaded");
  init();
});
//#endregion
