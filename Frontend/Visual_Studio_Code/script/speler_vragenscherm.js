const delay = ms => new Promise(res => setTimeout(res, ms));

//#region FUNCTIONS

//#region GET

//#region show

//#region ListenTo
var nextpage = async function(){
    await delay(4000);
    location.href = "speler_antwoordenscherm.html";
}

//#region init
const init = function() {
    nextpage();
};


document.addEventListener('DOMContentLoaded', function(){
  console.info("Page loaded");
  init();
});
//#endregion
