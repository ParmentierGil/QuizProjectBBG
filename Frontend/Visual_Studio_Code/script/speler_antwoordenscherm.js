
var timerfunctie = function(){
    var timer = document.querySelector("#tijd");
    var counter = 0;
    setInterval(timeIt, 1000);
    timer.innerhtml = counter;

    function timeIt(){
        counter++;
        timer.innerHTML = counter;  
    }

    var optie1 = document.getElementById("optie1")
    var optie3 = document.getElementById("optie3")
    var optie4 = document.getElementById("optie4")

    optie1.addEventListener("click", straf);
    optie3.addEventListener("click", straf);
    optie4.addEventListener("click", straf);

    function straf(){
        counter = counter +10;
        timer.innerHTML = counter;  
    }
}


document.addEventListener('DOMContentLoaded', function(){
    timerfunctie();
});
