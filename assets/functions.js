function moreButton (buttonId, divId, label) {
    var dat = document.getElementById(buttonId);
    var div = document.getElementById(divId);
    if (dat.innerHTML === label) {
        dat.innerHTML = "Hide";
        div.style.display = "block";
        window.setTimeout(function() {
            div.style.transform = "scaleX(1)";
            div.style.opacity = "1";
        }, 700);

    } else if (dat.innerHTML === "Hide"){
        dat.innerHTML = label;
        div.style.transform = "scaleX(0)";
        div.style.opacity = "0";
           
        window.setTimeout(function() {
            div.style.display = "none";
        }, 700);
    }
}