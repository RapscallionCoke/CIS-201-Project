let entries = [];

const entriesPerPage = 4;

// Read page from URL
const params = new URLSearchParams(window.location.search);
let currentPage = parseInt(params.get("page")) || 1;

// Load entries
async function loadEntries() {

    let response = await fetch("entries.json");
    entries = await response.json();

    renderEntries();
    renderPagination();

}

// Render entries
function renderEntries() {

    let container = document.getElementById("journal-container");
    container.innerHTML = "";

    let start = (currentPage - 1) * entriesPerPage;
    let end = start + entriesPerPage;

    let visibleEntries = entries.slice(start, end);

    visibleEntries.forEach(entry => {

        let div = document.createElement("div");
        div.className = "entry";

        div.innerHTML = `
            <h2>${entry.title}</h2>
            <h3>${entry.date}</h3>
            <p>${entry.text}</p>
        `;

        container.appendChild(div);

    });

}

// Render pagination
function renderPagination() {

    let totalPages = Math.ceil(entries.length / entriesPerPage);

    let pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {

        let button = document.createElement("button");
        button.innerText = i;

        button.addEventListener("click", () => {

            history.pushState({}, "", `?page=${i}`);
            currentPage = i;
            renderEntries();

        });

        pagination.appendChild(button);

    }

}

// Handle back/forward buttons
window.onpopstate = () => {

    const params = new URLSearchParams(window.location.search);
    currentPage = parseInt(params.get("page")) || 1;

    renderEntries();

};

// Start
loadEntries();