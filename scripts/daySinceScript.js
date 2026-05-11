const creationDate = new Date("2026-4-5");

const todayDate = new Date();

const difference = todayDate - creationDate;

const days = Math.floor(difference / (1000 * 60 * 60 * 24));

document.getElementById("daySince").innerHTML =  `HazesOnCouches is currently: <p style="color: orangered;"><i>${days}</i> days old!</p>`;

