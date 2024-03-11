
let date=new Date(); // creates a new date object with the current date and time
let year=date.getFullYear(); // gets the current year
let month=date.getMonth(); // gets the current month (index based, 0-11)

const day=$(".calendar-dates")[0]; // selects the element with class "calendar-dates"
const currdate=$(".calendar-current-date")[0]; // selects the element with class "calendar-current-date"
const prenexIcons=document.querySelectorAll(".calendar-navigation i"); // selects all elements with class "calendar-navigation span"


var days_off;
let days_off_prom = fetch("/nono-days.txt")
    .then(response => response.json())
    .then(data => {days_off = data;})

const months=[
"January",
"February",
"March",
"April",
"May",
"June",
"July",
"August",
"September",
"October",
"November",
"December"]; // array of month names

var zero_pad = function(number, digits = 2){
    let num = String(number);
    while (num.length < digits) {
        num = "0" + num;
    }
    return num;
}

var textify = function(year_in, month_in, date_in){
    console.log("textifying " + year_in + " " + month_in + " " + date_in)

    return String(year_in) + "-" + zero_pad(month_in+1) + "-" + zero_pad(date_in)
}

// check if a date is in the no-go date list
var date_check = function(yr, mo, da){
    // collect string reps of the date
    let date_string = textify(yr, mo, da);
    console.log("date string " + date_string)

    var present = days_off.includes(date_string)
    console.log("Present? " + present)
    return present;
}
// function to generate the calendar
var manipulate = async function() {
    
    // get the first day of the month
    let dayone=new Date(year, month, 1).getDay();

    // get the last date of the month
    let lastdate=new Date(year, month + 1, 0).getDate();

    // get the day of the last date of the month
    let dayend=new Date(year, month, lastdate).getDay();

    // get the last date of the previous month
    let monthlastdate=new Date(year, month, 0).getDate();

    let lit=""; // variable to store the generated calendar HTML
    // console.log("dayone = " + dayone)

    for (let i = 0; i < days_off.length; i++){
        let day = days_off[i];
        console.log(day);
    }

    // loop to add the last dates of the previous month
    for (let i=dayone; i > 0; i--) {
        lit+=`<li class="inactive">${monthlastdate - i + 1}</li>`;
    }

    // loop to add the dates of the current month
    for (let i=1; i <=lastdate; i++) {
        // check if the current date is today
        let isToday=i===new Date().getDate() && month===new Date().getMonth() && year===new Date().getFullYear() ? "active": "";
        let isNono=date_check(year, month, i) ? "nono" : "";
        lit+=`<li class="${isToday} ${isNono}">${i}</li>`;
    }

    // loop to add the first dates of the next month
    for (let i=dayend; i < 6; i++) {
        lit+=`<li class="inactive">${i - dayend + 1}</li>`
    }

    // update the text of the current date element with the formatted current month and year
    currdate.innerText=`${months[month]} ${year}`;

    // update the HTML of the dates element with the generated calendar
    day.innerHTML=lit;
}

// console.log(days_off_prom);
days_off_prom.then(() => 
    manipulate()
)

// Attach a click event listener to each icon
console.log(day)

console.log(currdate)

console.log(prenexIcons)
prenexIcons.forEach(icon=> {

// When an icon is clicked
icon.addEventListener("click", ()=> {
    // Check if the icon is "calendar-prev" or "calendar-next"
    month=icon.id==="calendar-prev" ? month - 1 : month + 1;

    // Check if the month is out of range
    if (month < 0 || month > 11) {
        // Set the date to the first day of the month with the new year
        date=new Date(year, month, new Date().getDate());
        // Set the year to the new year
        year=date.getFullYear();
        // Set the month to the new month
        month=date.getMonth();
    }

    else {
        // Set the date to the current date
        date=new Date();
    }

    // Call the manipulate function to update the calendar display
    manipulate();
});
});