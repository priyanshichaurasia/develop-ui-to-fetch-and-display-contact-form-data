// put validation code here

let addMoreClicked = false;
let contacts = [];
let errorsummary = [];

//birthdate
document
  .getElementById("birthdate")
  .setAttribute("max", new Date().toISOString().split("T")[0]);

//submitevent
const submitContact = (event) => {
  event.preventDefault();
  let formobj = document.getElementById("dataform");
  let dataobj = Object.fromEntries(new FormData(formobj));
  errorsummary = [];
  contacts = [];
  var isValid = validatedata(dataobj);
  console.log("IS VALID " + isValid);
  if (isValid == true) {
    senddata(dataobj);
  }
};

axios
  .get("localhost:3000/errorsummary")
  .then((response) => {
    errorsummary = response.data;
    errorsummary.sort(sorting);
    response.data.forEach((r) => {
      let formdata = "";
      formdata += "<tr>";
      formdata += "<td>" + r.firstname + "</td>";
      formdata += "<td>" + r.lastname + "</td>";
      formdata += "<td>" + r.email + "</td>";
      formdata += "<td>" + r.homeNo + "</td>";
      // formdata += "<td>"<button type="button" class="btn btn-primary">+</button>"</td>";
      formdata += "</tr>";
      console.log(r);
    });

    document.getElementById("contact-list").innerHTML = formdata;
  })
  .catch(function (error) {
    console.log(error);
  });

//persistant function
// function senddata(dataobj){
// axios.post("http://localhost:3000/errorsummary").then((response)=>{
//   console.log("Added Successfully" +JSON.stringify(dataobj));
// })
// .catch(err=>{
//   console.log("Error in Adding" +err);
// })
// }
function senddata(dataobj) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:3000/errorsummary", true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify(dataobj));

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 201) {
      alert("Data added successfully");
    }
  };
}
function sorting(d1, d2) {
  if (d1.firstname < d2.firstname) {
    return -1;
  } else {
    return 1;
  }
}

// listen to click of addContact button and add maximum of two additional inputs for inputting Contact Nos.
function addmore(event) {
  event.preventDefault();
  let contact = document.getElementById("contactNos");
  let newrow = document.createElement("div");
  newrow.classList.add("row");
  let newdiv1 = document.createElement("div");
  newdiv1.classList.add("col-md-6");
  let newc1 = document.createElement("input");
  newc1.classList.add("form-control");
  newc1.classList.add("form-control-sm");
  newc1.name = "additionalNo1";
  newc1.id = "additionalNo1";
  newc1.placeholder = "Additional contact no 1";
  //smallid for err1
  let c1 = document.createElement("small");
  c1.id = "c1error";
  newdiv1.appendChild(c1);
  newdiv1.appendChild(newc1);
  newrow.appendChild(newdiv1);

  let newdiv2 = document.createElement("div");
  newdiv2.classList.add("col-md-6");
  let newc2 = document.createElement("input");
  newc2.classList.add("col-md-6");
  newc2.classList.add("form-control");
  newc2.classList.add("form-control-sm");
  newc2.name = "additionalNo2";
  newc2.id = "additionalNo2";
  newc2.placeholder = "Additional contact no 2";
  //smallid for err2
  let c2 = document.createElement("small");
  c2.id = "c2error";
  newdiv2.appendChild(c2);
  newdiv2.appendChild(newc2);
  newrow.appendChild(newdiv2);
  contact.append(newrow);
  document.getElementById("addContactNo").disabled = true;
  addMoreClicked = true;
}

//function to display validation summary with error messages provided
function validatedata(dataobj) {
  //disable all dates for whom age is less than 18
  let dob = document.getElementById("birthdate").value;
  let currentage =
    parseInt(new Date().getFullYear()) - parseInt(new Date(dob).getFullYear());
  console.log(currentage);
  document.getElementById("birthdateError").innerHTML = "Age : " + currentage;
  if (currentage < 15) {
    document.getElementById("birthdate").disabled = true;
  }

  validateFirstName(dataobj.firstname);
  validateLastName(dataobj.lastname);
  validateEmail(dataobj.email);
  validateHomeNo(dataobj.homeNo);
  validateWorkNo(dataobj.workNo);
  validateNotes(dataobj.notes);
  console.log("addMoreClicked " + addMoreClicked);
  if (addMoreClicked == true) {
    validateAddMore1(dataobj.additionalNo1);
    validateAddMore2(dataobj.additionalNo2);
  }

  validateSummary();
  console.log(dataobj);
  if (errorsummary.length == 0) {
    console.log("No error returning true " + JSON.stringify(errorsummary));
    return true;
  } else {
    return false;
  }
}

//function to validate firstName
function validateFirstName(fname) {
  if (fname == "") {
    document.getElementById("firstNameError").innerHTML =
      "FirstName Must Be Entered";
    errorsummary.push("FirstName Must Be Entered");
  } else if (fname.match("[a-zA-zs.]")) {
    document.getElementById("firstNameError").innerHTML = "";
  } else {
    document.getElementById("firstNameError").innerHTML =
      "FirstName should only be alphabets and (.)";
  }
}

//function to validate lastName
function validateLastName(lname) {
  if (lname == "") {
    document.getElementById("lastNameError").innerHTML =
      "LastName Must Be Entered";
    errorsummary.push("LastName Must Be Entered");
  } else if (lname.match("[a-zA-z.]")) {
    document.getElementById("lastNameError").innerHTML = "";
  } else {
    document.getElementById("lastNameError").innerHTML =
      "LastName should only be alphabets and (.)";
  }
}

//function to validate email
function validateEmail(email) {
  if (email == "") {
    document.getElementById("emailError").innerHTML = "Email Must Be Entered";
    errorsummary.push("Email Must Be Entered");
  } else if (
    email.match("^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$")
  ) {
    document.getElementById("emailError").innerHTML = "";
  } else {
    document.getElementById("emailError").innerHTML =
      "Email should be of the format: example@domain.com";
  }
}

//function to validate home no
function validateHomeNo(homeNo) {
  if (homeNo == "") {
    document.getElementById("homeNoError").innerHTML =
      "Home Contact No Must Be Entered";
    errorsummary.push("Home Contact No Must Be Entered");
  } else if (homeNo.match("[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[()-s./0-9]*$")) {
    document.getElementById("homeNoError").innerHTML = "";
    contacts.push(homeNo);
  } else {
    document.getElementById("homeNoError").innerHTML =
      "not a valid phone numbe";
  }
}

//function to validate work no
function validateWorkNo(workNo) {
  if (workNo == "") {
    document.getElementById("workNoError").innerHTML =
      "Work Contact No Must Be Entered";
    errorsummary.push("Work Contact No Must Be Entered");
  } else if (workNo.match("[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[()-s./0-9]*$")) {
    document.getElementById("workNoError").innerHTML = "";
    contacts.push(workNo);
  } else {
    document.getElementById("workNoError").innerHTML =
      "not a valid phone number";
  }
}

//function to validate additional contact no1
function validateAddMore1(c1add) {
  if (c1add == "") {
    document.getElementById("c1error").innerHTML = "Enter contact no";
    errorsummary.push("Enter contact no");
  } else if (c1add.match("[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[()-s./0-9]*$")) {
    document.getElementById("c1error").innerHTML = "";
    contacts.push(c1add);
  } else {
    document.getElementById("c1error").innerHTML = "not a valid phone number";
  }
}
//function to validate additional contact no2
function validateAddMore2(c2add) {
  if (c2add == "") {
    document.getElementById("c2error").innerHTML = "Enter contact no";
    errorsummary.push("Enter contact no");
  } else if (c2add.match("[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[()-s./0-9]*$")) {
    document.getElementById("c2error").innerHTML = "";
    contacts.push(c2add);
  } else {
    document.getElementById("c2error").innerHTML = "not a valid phone number";
  }
}

//function to validate notes
function validateNotes(notes) {
  if (notes == "") {
    document.getElementById("notesError").innerHTML = "Notes Must Be Entered";
    errorsummary.push("Notes Must Be Entered");
  } else if (notes.match("[a-zA-z]{1,200}")) {
    document.getElementById("notesError").innerHTML = "";
  } else {
    document.getElementById("notesError").innerHTML =
      "Notes should not be more than 200 characters";
  }
}

function validateSummary() {
  let content = "";
  for (i = 0; i < errorsummary.length; i++) {
    content = content + `<li>${errorsummary[i]}</li>`;
  }
  console.log(errorsummary);

  //function to display error messages alongside the input fields
  document.getElementById("validationSummary").innerHTML = content;
}
