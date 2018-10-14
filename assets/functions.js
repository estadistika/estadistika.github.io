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

function openCity(evt, cityName, content) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName(content);
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}