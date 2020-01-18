

let button = document.getElementById("click-me");
button.addEventListener("click", debouce);

let handler = 0;
function debouce() {
    if(handler)
        clearInterval(handler);

    handler = setInterval(display, 3000)
}

function display() {
    console.log("hey User !!!");
}



