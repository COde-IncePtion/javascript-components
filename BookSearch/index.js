const queryInputField = document.getElementById('search-query-input');
const searchResultSection = document.getElementById('search-results-section');
const searchResultSectionSentinel = document.getElementById('search-result-sentinel');

const searchParams = {
    query: "",
    pageNumber: 1,
    pageSize: 20,
}

let booksSearchResults = [];
let isLoading = false;

queryInputField.addEventListener("keydown", handleSearchQueryInput)

function handleSearchQueryInput(e) {
    console.log("handleSearchQueryInput = ",e.key);
    if (e.key === 'Enter') {
        searchParams.query = e.target.value;
        searchResultSection.innerHTML="";
        booksSearchResult = [];
        searchParams.pageNumber = 1;
        fetchBooks();
    }
}


function setUpIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        if (entries.length > 0 && entries[0].isIntersecting) {
            onIntersection();
        }
    });

    observer.observe(searchResultSectionSentinel);
}

function onIntersection() {
    console.log("onIntersection callback triggered");

    if (searchParams.query !== "") {
        searchParams.pageNumber += 1;
        fetchBooks();
    }
}


function createSearchResultsRow(bookData) {
    const searchResultRow = document.createElement("div");
    searchResultRow.classList.add("search-result-item");

    const bookTitle = document.createElement("h3");
    bookTitle.innerText = bookData.title;
    searchResultRow.appendChild(bookTitle);

    return searchResultRow;
}

function renderSearchResults(booksSearchResults) {
    const fragmentNode = document.createDocumentFragment();

    booksSearchResults.forEach(bookResult => {
        fragmentNode.append(createSearchResultsRow(bookResult))
    });

    searchResultSection.appendChild(fragmentNode);
}

async function fetchBooks() {
    const {query, pageNumber, pageSize} = searchParams;
    try {
        isLoading = true;
        searchResultSectionSentinel.innerHTML = "Loading...";
        const response = await fetch(`https://openlibrary.org/search.json?q=${query}&page=${pageNumber}&limit=${pageSize}`);

        if (!response.ok) {
            const error = new Error();
            error.status = response.status;
            error.message = response.message;
            throw error;
        }

        const responseJson = await response.json();
        booksSearchResults = booksSearchResults.concat(responseJson.docs);

        renderSearchResults(booksSearchResults);
    } catch (error) {
        console.error("error in fetching books", error);
    } finally {
        isLoading = false;
        searchResultSectionSentinel.innerHTML = "";
    }
}

setUpIntersectionObserver();

