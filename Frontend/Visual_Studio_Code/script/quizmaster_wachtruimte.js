//#region FUNCTIONS

//#endregion

//#region GET

let getAllQuestionsAndExercises = function() {
    
};

//#endregion

//#region show

//#endregion

//#region ListenTo

let listenToPlay = function() {
  let playButton = document.querySelector(".playbutton");
  playButton.addEventListener("click", getAllQuestionsAndExercises);
};

//#endregion

//#region init

const init = function() {
  listenToPlay();
};

document.addEventListener("DOMContentLoaded", function() {
  console.info("Productpage loaded");
  init();
});
//#endregion
