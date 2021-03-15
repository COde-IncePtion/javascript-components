
const fetchDataThrottled = throttle(fetchData, 2000);

let button = document.getElementById("click-me");
button.addEventListener("click", fetchDataThrottled);

function throttle(fn, delay) {
    let delayFinished = true;
    return () => {
        if (delayFinished){
            console.log("hey")
            delayFinished=false;
            fn();

            setTimeout(()=>{
                delayFinished=true;
            }, delay)
        }
    }
}

function fetchData() {
    console.log("Fetching data ...");
}
