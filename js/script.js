/* 

to do for exceeds:
- ≥1 real-time validation
- ≥1 custom error message responding to user input
- real-time validation / conditional error messages detailed in README

email

*/

/*--------------

  BASIC INFO

--------------*/

let textFields = document.querySelectorAll("input[type=text]");
let nameField = textFields[0];

//cursor on name field on load
nameField.focus();

//hide other job role input
let other = document.getElementById("other-job-role");
other.style.display = "none";

//toggle show / hide other job role input
let role = document.getElementById("title");
role.onchange = () => {
  if (role.value === "other") {
    other.style.display = "block";
  } else {
    other.style.display = "none";
  }
};

//disable color select
const color = document.getElementById("color");
color.disabled = true;

//handle t-shirt design / color functionality
const design = document.getElementById("design");
design.onchange = () => {
  color.disabled = false;
  if (design.value === "js puns") {
    color.selectedIndex = 1;
    let i;
    for (let i = 1; i < color.children.length; i++) {
      if (i > 3) {
        color[i].style.display = "none";
      } else {
        color[i].style.display = "block";
      }
    }
  } else {
    color.selectedIndex = 4;
    for (let i = 1; i < color.children.length; i++) {
      if (i < 4) {
        color[i].style.display = "none";
      } else {
        color[i].style.display = "block";
      }
    }
  }
};

/*--------------------------

  REGISTER FOR ACTIVITIES

--------------------------*/

//selects array of activity containers
const activitiesFieldset = document.getElementById("activities");
const activityContainers = activitiesFieldset.children[1].children;

//pulls cost from selections and returns totals
function getCost() {
  let total = 0; //will become displayed total on form
  for (let i = 0; i < activityContainers.length; i++) {
    let activity = activityContainers[i].children[0]; //iterates through each activity
    if (activity.checked) {
      //checks for checks
      let cost = parseInt(activity.getAttribute("data-cost")); //extracts number string and creates number object, stored in 'cost'
      total += cost; //adds number to total
    }
  }
  return total; //returns number object reflecting total cost
}

//changes "Tuesday" to 1 and "Wednesday" to 2 -- called back in multiple functions below
function dayNumber(input) {
  let n = 0;
  if (input === "Tuesday") {
    n = 1;
  } else {
    n = 2;
  }
  return n;
}

function makeDateTimeObjects() {
  let arr = [];
  for (let i = 1; i < activityContainers.length; i++) {
    //excludes main conference
    let input = activityContainers[i].children[0];
    let dateInfo = activityContainers[i].children[2].innerText;
    let splitDateTime = dateInfo.split(" "); //dividing page info into usable indices
    let day = splitDateTime[0];
    day = dayNumber(day);
    let time = splitDateTime[1]; //extracts time string
    time = parseInt(time); //returns start time number
    let scheduleNumber = day + "" + time; //a string which can be used for comparison to other activities
    let object = {
      input,
      scheduleNumber,
    };
    arr.push(object); //forms initial array for comparison to user input
  }
  return arr;
}

//grabs scheduleNumber from user input
function getActivityDayTime(input) {
  //get user input data
  let daytime = input.getAttribute("data-day-and-time");
  let split = daytime.split(" ");
  let day = split[0];
  day = dayNumber(day); //returns number for day
  let time = parseInt(split[1]);
  let scheduleNumber = day + "" + time;
  return scheduleNumber;
}

//check for conflicts
function conflictCheck(input, scheduleNumber) {
  //scheduleNumber derived from getActivityDayTime();
  let events = makeDateTimeObjects(); //big array of all activity objects containing 'input' and 'scheduleNumber' keys
  let inputName = input.getAttribute("name");

  for (let i = 0; i < events.length; i++) {
    let eventName = events[i].input.getAttribute("name");
    let eventScheduleNumber = events[i].scheduleNumber;
    let activity = activityContainers[i + 1].children[0];

    if (
      input.checked && //only works if input element checked
      eventName !== inputName && //if the user selection is different than the object input and
      eventScheduleNumber === scheduleNumber //if the scheduleNumber is the same
    ) {
      activity.disabled = true; //turn the conflicting item off
      activityContainers[i + 1].style.backgroundColor = "darkGray";
    } else if (
      !input.checked &&
      eventName !== inputName &&
      eventScheduleNumber === scheduleNumber
    ) {
      activity.disabled = false;
      activityContainers[i + 1].style.backgroundColor = "";
    }
  }
}

//listener callback
function activityChange(e) {
  let mainConference = activityContainers[0].children[0];
  let totalText = document.getElementById("activities-cost"); //selects appropriate page element to display total
  totalText.innerText = `Total: $${getCost()}`; //dynamically inserts total on page
  if (e.target !== mainConference) {
    let input = e.target;
    let scheduleNumber = getActivityDayTime(e.target); //gets scheduleNumber for comparison with full schedule objects
    conflictCheck(input, scheduleNumber);
  }
}

//listener
activitiesFieldset.addEventListener("change", (e) => activityChange(e));

//checkbox accessibility : focus / blur listeners
const checkboxes = document.querySelectorAll('input[type="checkbox"');

for (let i = 0; i < checkboxes.length; i++) {
  checkboxes[i].addEventListener("focus", () => {
    checkboxes[i].parentElement.className = "focus";
    checkboxes[i].addEventListener("blur", () => {
      checkboxes[i].parentElement.className = "";
    });
  });
}
/*----------------

  PAYMENT INFO

----------------*/

//cc preselection
const paymentMethod = document.getElementById("payment");
paymentMethod.selectedIndex = 1;

//assigning divs to variables
const creditCard = document.getElementById("credit-card");
const paypal = document.getElementById("paypal");
const bitcoin = document.getElementById("bitcoin");

//initial presentation
paypal.style.display = "none";
bitcoin.style.display = "none";

//handles changing payment methods / css display types
paymentMethod.onchange = () => {
  if (paymentMethod.value === "paypal") {
    creditCard.style.display = "none";
    paypal.style.display = "block";
    bitcoin.style.display = "none";
  } else if (paymentMethod.value === "bitcoin") {
    creditCard.style.display = "none";
    paypal.style.display = "none";
    bitcoin.style.display = "block";
  } else {
    creditCard.style.display = "block";
    paypal.style.display = "none";
    bitcoin.style.display = "none";
  }
};

/*------------------

  FORM VALIDATION

------------------*/

function errorListen(element, regex, bool) {
  element.addEventListener("input", () => {
    errorTest(element, regex, bool);
  });
}

function errorTest(element, regex, bool) {
  if (!regex.test(element.value)) {
    bool = false;
    invalid(element);
    if (element === emailField) {
      //check for @
      //check for .com
      const val = emailField.value;
      const textZone = emailField.parentElement.lastElementChild;
      const atRegEx = /^\w*[^@]\w*?[.]?\w*?$/;
      const domRegEx = /^\w*@$/;
      const comRegEx = /^\w*@\w+.?c?o?$/;
      if (atRegEx.test(val)) {
        textZone.innerText = "Please add an @ symbol";
      } else if (domRegEx.test(val)) {
        textZone.innerText = "Please a domain after the @ symbol";
      } else if (comRegEx.test(val)) {
        textZone.innerText = "Please add .com";
      } else {
        textZone.innerText = "Email address must be formatted correctly";
      }
    }
  } else {
    valid(element);
  }

  return bool;
}

//invalid element handler
function invalid(element) {
  const parent = element.parentElement;
  parent.className = "not-valid";
  parent.lastElementChild.style.display = "block";
}

//valid element handler
function valid(element) {
  const parent = element.parentElement;
  parent.className = "valid";
  parent.lastElementChild.style.display = "none";
}

//name validation
function checkName() {
  let bool = true;
  let regex = /\w+/;
  errorTest(nameField, regex, bool);
  return bool;
}

errorListen(nameField, /\w+/, true);

//email validation
const emailField = document.querySelector("input[type=email]");

function checkEmail() {
  let bool = true;
  let regex = /\w+@\w+.com/;
  errorTest(emailField, regex, bool);
  return bool;
}

errorListen(emailField, /\w+@\w+.com/, true);

//activity validation
function checkActivities() {
  let bool = false;
  for (let i = 0; i < activityContainers.length; i++) {
    let activity = activityContainers[i].children[0]; //iterates through each activity
    if (activity.checked) {
      bool = true;
    }
  }
  if (bool === false) {
    activitiesFieldset.className = "activities not-valid";
    activitiesFieldset.lastElementChild.style.display = "block";
  } else {
    activitiesFieldset.className = "activities valid";
    activitiesFieldset.lastElementChild.style.display = "none";
  }
  return bool;
}

//cc validation
const ccn = document.querySelector("#cc-num");

function checkCCN() {
  let bool = true;
  let regex = /^\d{13,16}$/;
  errorTest(ccn, regex, bool);
  return bool;
}

errorListen(ccn, /^\d{13,16}$/, true);

const zip = document.querySelector("#zip");

function checkZip() {
  let bool = true;
  let regex = /^\d{5}$/;
  errorTest(zip, regex, bool);
  return bool;
}

errorListen(zip, /^\d{5}$/, true);

const cvv = document.querySelector("#cvv");

function checkCVV() {
  let bool = true;
  let regex = /^\d{3}$/;
  errorTest(cvv, regex, bool);
  return bool;
}

errorListen(cvv, /^\d{3}$/, true);

//submit event handler
function submitHandler(e) {
  const stop = e.preventDefault();
  let valid = true;
  if (!checkName() || !checkEmail() || !checkActivities()) {
    valid = false;
  } else if (paymentMethod.value === "credit-card") {
    if (!checkCCN() || !checkZip() || !checkCVV) {
      valid = false;
    }
  }
  if (valid === false) {
    stop;
  } else {
    alert("Success!");
  }
}

//submit listener
const form = document.querySelector("form");
form.addEventListener("submit", (e) => submitHandler(e));
