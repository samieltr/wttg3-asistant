const typeMessage = setInterval(typing, 6000);

var b = 0;
var i = 0;
const txt = [
    "Hello Simon.",
    "Your visit has been logged.", 
    "Good to see you're still alive.",
    "We love watching you.",
    "It'd be a shame if you died."];
var speed = 75;

function typing() {
    if (i < txt[b].length) {
        document.getElementById("contact").innerHTML += txt[b].charAt(i);
        i++;
        setTimeout(typing, speed);
    } else if (i == txt[b].length) {
        setTimeout(changeText, 3000);
    }
}

function changeText() {
    let text = document.getElementById("contact").innerHTML;
    document.getElementById("contact").innerHTML = text.replace(txt[b], '');
    b++;
    i = 0;

    if (b == 5) {
        clearInterval(typeMessage);
    }
}