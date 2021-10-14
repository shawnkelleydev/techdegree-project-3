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

//pulls data from selections
function getSelections() {
  let total = 0; //will become displayed total on form
  for (let i = 0; i < activityContainers.length; i++) {
    let activity = activityContainers[i].children[0];
    if (activity.checked) {
      let cost = parseInt(activity.getAttribute("data-cost")); //extracts number from data-cost attribute
      total += cost; //adds number to total
    }
  }
  let totalText = document.getElementById("activities-cost");
  totalText.innerText = `Total: $${total}`;
  return total;
}
