var playerId;
var socket;
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
      alert.innerHTML = "Geef een code in";
      // valid = false;
      await delay(3000);
      alert.innerHTML = "";
    } else if (input.value.length != 4) {
      alert.innerHTML = "Ongeldige code";
      // valid = false;
      await delay(3000);
      alert.innerHTML = "";
    } else {
      console.log(playerId);
      socket.emit("joingame", {
        joincode: input.value.toUpperCase(),
        playerid: playerId
      });

      // location.href = 'speler_wachtruimte.html';
    }

    // return valid;
  });
};

//#region init
const init = function() {
  socket = io("ws://testsocketquiz.azurewebsites.net:80/", {
    transport: ["websocket"]
  });

  alertfunctie();

  playerId = localStorage.getItem("playerId");
  console.log(playerId);
  socket.emit("chat message", "Jongeeeee");
  socket.emit("my event");

  socket.on("joinCodeCorrect" + playerId, function(data) {
    localStorage.setItem("joinCode", data);
    console.log(data);
    location.href = "speler_chooseBTDevice.html";
  });
  socket.on("joinCodeFalse" + playerId, function() {
    console.log("False");
    var alert = document.querySelector(".alert");
    alert.innerHTML = "Ongeldige code";
  });

  socket.on("my response", function(data) {
    console.log(data);
  });
};

document.addEventListener("DOMContentLoaded", function() {
  console.info("Page loaded");
  init();
});
//#endregion
