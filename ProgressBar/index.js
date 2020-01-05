function progressBar() {
    let width = 10;
    let progressBarDiv = document.getElementById("progress-bar");
    let progressInterval = setInterval(moveProgressBar, 100);
    function moveProgressBar() {
        if (width <= 80) {
            width += 5;
            progressBarDiv.style.width=width+'%';
        }
        else
            clearInterval(progressInterval)
    }
}

progressBar();
