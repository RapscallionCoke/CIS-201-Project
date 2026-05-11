

// variables for every element needed to run this..
const calendarGrid =
    document.getElementById("calendar-grid");

const monthYear =
    document.getElementById("month-year");

const prevMonth =
    document.getElementById("prev-month");

const nextMonth =
    document.getElementById("next-month");

const entryTitle =
    document.getElementById("entry-title");

const entryDate =
    document.getElementById("entry-date");

const entryText =
    document.getElementById("entry-text");


// array entries
let entries = [];


// month
let currentDate = new Date();


// this has to load the entries before doing anything else!!! 
async function loadEntries() {

    let response =
        await fetch("scripts/entries.json");

    entries =
        await response.json();


    
    entries.sort(
        (a, b) =>
            new Date(b.id) -
            new Date(a.id)
    );


    // Check URL
    const params =
        new URLSearchParams(
            window.location.search
        );

    let selectedEntryID =
        params.get("entry");


    // If URL has entry
    if(selectedEntryID) {

        let matchingEntry =
            entries.find(
                entry =>
                    entry.id === selectedEntryID
            );

        if(matchingEntry) {

            showEntry(
                matchingEntry
            );

        }

    }

    // Otherwise show newest
    else {

        showEntry(
            entries[0]
        );

    }


    renderCalendar();

}


// Gen calendar
function renderCalendar() {

    calendarGrid.innerHTML = "";

    let year =
        currentDate.getFullYear();

    let month =
        currentDate.getMonth();


    // Month title
    monthYear.innerText =
        currentDate.toLocaleString(
            "default",
            {
                month: "long",
                year: "numeric"
            }
        );


    // First weekday
    let firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    // Total days
    let daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    // Empty spaces
    for(
        let i = 0;
        i < firstDay;
        i++
    ) {

        let empty =
            document.createElement(
                "div"
            );

        empty.className =
            "empty-day";

        calendarGrid.appendChild(
            empty
        );

    }


    // Generate days
    for(
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        let dayElement =
            document.createElement(
                "div"
            );

        dayElement.className =
            "calendar-day";

        dayElement.innerText =
            day;


        // Full date
        let fullDate =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


        // Find matching entry
        let matchingEntry =
            entries.find(
                entry =>
                    entry.id === fullDate
            );


        // Highlight entries
        if(matchingEntry) {

            dayElement.classList.add(
                "has-entry"
            );


            // Click event
            dayElement.addEventListener(
                "click",
                () => {

                    // Update URL
                    history.pushState(
                        {},
                        "",
                        `?entry=${matchingEntry.id}`
                    );


                    // Fade out
                    entryText.style.opacity =
                        0;


                    setTimeout(() => {

                        showEntry(
                            matchingEntry
                        );


                        // Fade in
                        entryText.style.opacity =
                            1;

                    }, 150);

                }
            );

        }


        // Highlight today
        let today =
            new Date();

        if(
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {

            dayElement.classList.add(
                "today"
            );

        }


        calendarGrid.appendChild(
            dayElement
        );

    }

}


// Show entry
function showEntry(entry) {

    entryTitle.innerText =
        entry.title;

    entryDate.innerText =
        entry.id;

    entryText.innerHTML =
        entry.text;

}


// Previous month
prevMonth.addEventListener(
    "click",
    () => {

        currentDate.setMonth(
            currentDate.getMonth() - 1
        );

        renderCalendar();

    }
);


// Next month
nextMonth.addEventListener(
    "click",
    () => {

        currentDate.setMonth(
            currentDate.getMonth() + 1
        );

        renderCalendar();

    }
);


// Browser back/forward support
window.onpopstate = () => {

    const params =
        new URLSearchParams(
            window.location.search
        );

    let selectedEntryID =
        params.get("entry");


    if(selectedEntryID) {

        let matchingEntry =
            entries.find(
                entry =>
                    entry.id === selectedEntryID
            );

        if(matchingEntry) {

            showEntry(
                matchingEntry
            );

        }

    }

};


// Start app
loadEntries();