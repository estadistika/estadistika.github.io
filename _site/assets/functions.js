function moreButton(buttonId, divId, label) {
    var dat = document.getElementById(buttonId);
    var div = document.getElementById(divId);
    if (dat.innerHTML === label) {
        dat.innerHTML = "Hide";
        div.style.display = "block";
        window.setTimeout(function () {
            div.style.transform = "scaleX(1)";
            div.style.opacity = "1";
        }, 700);

    } else if (dat.innerHTML === "Hide") {
        dat.innerHTML = label;
        div.style.transform = "scaleX(0)";
        div.style.opacity = "0";

        window.setTimeout(function () {
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

function toggleMagnify(imgId, zoom) {
    toggle = document.getElementById("toggle-magnifier-072019");

    if (toggle.checked == true) {
        magnify(imgId, zoom)
        document.getElementsByClassName("img-magnifier-glass")[0].style.display = "block";
    } else {
        document.getElementsByClassName("img-magnifier-glass")[0].style.display = "none";
    }
}

function magnify(imgID, zoom) {
    var img, glass, w, h, bw;
    img = document.getElementById(imgID);
    /*create magnifier glass:*/

    glass = document.getElementsByClassName("img-magnifier-glass")

    if (glass.length == 0) {
        glass = document.createElement("DIV");
        glass.setAttribute("class", "img-magnifier-glass");
    } else {
        glass = glass[0]
    }

    /*insert magnifier glass:*/
    img.parentElement.insertBefore(glass, img);
    /*set background properties for the magnifier glass:*/
    glass.style.backgroundImage = "url('" + img.src + "')";
    glass.style.backgroundRepeat = "no-repeat";
    glass.style.backgroundSize = (img.width * zoom) + "px " + (img.height * zoom) + "px";
    bw = 3;
    w = glass.offsetWidth / 2;
    h = glass.offsetHeight / 2;
    /*execute a function when someone moves the magnifier glass over the image:*/
    glass.addEventListener("mousemove", moveMagnifier);
    img.addEventListener("mousemove", moveMagnifier);
    /*and also for touch screens:*/
    glass.addEventListener("touchmove", moveMagnifier);
    img.addEventListener("touchmove", moveMagnifier);
    function moveMagnifier(e) {
        var pos, x, y;
        /*prevent any other actions that may occur when moving over the image*/
        e.preventDefault();
        /*get the cursor's x and y positions:*/
        pos = getCursorPos(e);
        x = pos.x;
        y = pos.y;
        /*prevent the magnifier glass from being positioned outside the image:*/
        if (x > img.width - (w / zoom)) { x = img.width - (w / zoom); }
        if (x < w / zoom) { x = w / zoom; }
        if (y > img.height - (h / zoom)) { y = img.height - (h / zoom); }
        if (y < h / zoom) { y = h / zoom; }
        /*set the position of the magnifier glass:*/
        glass.style.left = (x - w) + "px";
        glass.style.top = (y - h) + "px";
        /*display what the magnifier glass "sees":*/
        glass.style.backgroundPosition = "-" + ((x * zoom) - w + bw) + "px -" + ((y * zoom) - h + bw) + "px";
    }
    function getCursorPos(e) {
        var a, x = 0, y = 0;
        e = e || window.event;
        /*get the x and y positions of the image:*/
        a = img.getBoundingClientRect();
        /*calculate the cursor's x and y coordinates, relative to the image:*/
        x = e.pageX - a.left;
        y = e.pageY - a.top;
        /*consider any page scrolling:*/
        x = x - window.pageXOffset;
        y = y - window.pageYOffset;
        return { x: x, y: y };
    }
}