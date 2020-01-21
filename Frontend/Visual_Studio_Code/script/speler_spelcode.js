//#region FUNCTIONS

//#region GET

//#region show
const delay = ms => new Promise(res => setTimeout(res, ms));

//#region ListenTo
var alertfunctie = function(){
    var input = document.querySelector(".inputColor");
    var submit = document.querySelector(".buttonCodeScreen");
    var alert = document.querySelector(".alert");

    submit.addEventListener("click", async function(){
        valid = true;

        if(input.value == "") {
            alert.style.display = "block";
            valid = false;
            await delay(3000);
            alert.style.display = "none"
        }

        else{
            location.href="speler_wachtruimte.html";
        }

        return valid;
    });
    
}


//#region init
const init = function() {
    alertfunctie();
  };


document.addEventListener('DOMContentLoaded', function(){
    console.info("Page loaded");
    init();
});
//#endregion
