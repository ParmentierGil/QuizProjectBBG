
var timerfunctie = function(){
    var timer = document.querySelector("#tijd");
    var counter = 0;
    setInterval(timeIt, 1000);
    timer.innerhtml = counter;

    function timeIt(){
        counter++;
        timer.innerHTML = counter;  
    }


    var foute_antwoorden = document.querySelectorAll(".fout_antwoord")

    for(var antwoord of foute_antwoorden){
        antwoord.addEventListener("click", fout);
    }

    function fout(){
        counter = counter +10;
        timer.innerHTML = counter;  
    }
}


document.addEventListener('DOMContentLoaded', function(){
    timerfunctie();
});
