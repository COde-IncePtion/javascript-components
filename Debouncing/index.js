
const fetchDataDebounced = debounce(fetchData, 1000);

let button = document.getElementById("click-me");
button.addEventListener("click", fetchDataDebounced);

function debounce(fn, delay) {
    let timer = null;

    return () => {
        if (timer)
            clearTimeout(timer);

        timer = setTimeout(fn, delay)
    }
}

function fetchData() {
    console.log("Fetching data ...");
}
