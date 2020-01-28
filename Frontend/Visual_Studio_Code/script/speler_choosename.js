var socket;

var playerId;

//#region FUNCTIONS

//#region GET

//#region show
const delay = ms => new Promise(res => setTimeout(res, ms));

//#region ListenTo
var listenToKeypress = function() {
  return (
    (event.charCode > 64 && event.charCode < 91) ||
    (event.charCode > 96 && event.charCode < 123)
  );
};
var alertfunctie = function() {
  var input = document.querySelector(".inputColor2");
  var submit = document.querySelector(".buttonCodeScreen");
  var alert = document.querySelector(".alert");

  submit.addEventListener("click", async function() {
    if (input.value == "") {
      alert.innerHTML = "Vul je naam in";
      await delay(3000);
      alert.innerHTML = "";
    } else {
      socket.emit("makeplayer", { username: input.value });
    }
  });
};
//#region init
const init = function() {
  socket = io("http://172.30.248.87:5500");

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
