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
