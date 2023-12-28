//login variables
var loginEmailInput = document.querySelector("#loginEmailInput");
var loginPasswordInput = document.querySelector("#loginPasswordInput");
var loginStatusMessage = document.querySelector("#loginStatusMessage");

//sign up variables
var signUpNameInput = document.querySelector("#signUpNameInput");
var signUpEmailInput = document.querySelector("#signUpEmailInput");
var signUpPasswordInput = document.querySelector("#signUpPasswordInput");
var signUpStatusMessage = document.querySelector("#signUpStatusMessage");

//homepage variables
var homepageWelcomeText = document.querySelector("#homepageWelcomeText");

//regex constants
const nameRegex = /^[a-zA-Z]{3,}$/;
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex = /^[\w\._\h]{6,}$/;

var activeSession = undefined;
var credentialsArr = [];
if (localStorage.getItem("credentials") != null) {
  credentialsArr = JSON.parse(localStorage.getItem("credentials"));
}
if (localStorage.getItem("activeSession") != null) {
  activeSession = JSON.parse(localStorage.getItem("activeSession"));
}

// route to homepage immediately if active session exists
if (activeSession) {
  if (!window.location.href.includes("homepage.html")) {
    window.location = "homepage.html";
  }
  homepageWelcomeText.innerHTML = "Welcome " + activeSession.name;
}

function login() {
  if (
    loginEmailInput.value.length == 0 ||
    loginPasswordInput.value.length == 0
  ) {
    showStatusMessage(loginStatusMessage, "All fields are required", true);
    return;
  }

  const loginCredentials = {
    email: loginEmailInput.value,
    password: loginPasswordInput.value,
  };

  const isCredentialsFound = checkCredentials(loginCredentials);
  if (isCredentialsFound) {
    showStatusMessage(loginStatusMessage, "Success", false);

    //save to active session after succesful login
    const loggedInIndex = findEmail(loginCredentials.email);
    activeSession = {
      name: credentialsArr[loggedInIndex].name,
      email: credentialsArr[loggedInIndex].email,
    };
    localStorage.setItem("activeSession", JSON.stringify(activeSession));

    //route to homepage
    setTimeout(function () {
      window.location = "homepage.html";
    }, 1000);
  } else {
    showStatusMessage(loginStatusMessage, "Wrong email or password", true);
  }
}

function signUp() {
  if (
    signUpNameInput.value.length == 0 ||
    signUpEmailInput.value.length == 0 ||
    signUpPasswordInput.value.length == 0
  ) {
    showStatusMessage(signUpStatusMessage, "All fields are required", true);
    return;
  }

  const signUpCredentials = {
    name: signUpNameInput.value,
    email: signUpEmailInput.value,
    password: signUpPasswordInput.value,
  };

  //only if first function is true, will the other functions get called, therefore only one error message will be displayed
  if (
    checkNameRegex(signUpCredentials.name) &&
    checkEmailRegex(signUpCredentials.email) &&
    checkPasswordRegex(signUpCredentials.password)
  ) {
    //check if email is not registered
    let foundIdx = findEmail(signUpCredentials.email);
    if (foundIdx != -1) {
      showStatusMessage(signUpStatusMessage, "Email already exists", true);
      return;
    }

    credentialsArr.push(signUpCredentials);
    localStorage.setItem("credentials", JSON.stringify(credentialsArr));

    showStatusMessage(signUpStatusMessage, "Success", false);
    setTimeout(function () {
      window.location = "index.html";
    }, 1000);
  }
}

function checkNameRegex(name) {
  const isNameValid = nameRegex.test(name);
  if (!isNameValid) {
    showStatusMessage(
      signUpStatusMessage,
      "Name must be 3 or more alphabetical characters",
      true
    );
    return false;
  }

  return true;
}

function checkEmailRegex(email) {
  const isEmailValid = emailRegex.test(email);
  if (!isEmailValid) {
    showStatusMessage(signUpStatusMessage, "Invalid Email", true);
    return false;
  }

  return true;
}

function checkPasswordRegex(password) {
  const isPasswordValid = passwordRegex.test(password);
  if (!isPasswordValid) {
    showStatusMessage(
      signUpStatusMessage,
      "Password must be 6 or more characters long and contain alphanumeric characters, whitespace and the '.' or '_' special characters",
      true
    );
    return false;
  }

  return true;
}

function showStatusMessage(displayElement, displayString, isError) {
  let textClass = "text-success";
  if (isError) {
    textClass = "text-danger";
  }

  displayElement.classList.remove("d-none");
  displayElement.classList.add(textClass);
  displayElement.innerHTML = displayString;
}

function checkCredentials(loginCredentials) {
  let foundIdx = findEmail(loginCredentials.email);
  if (foundIdx != -1) {
    if (loginCredentials.password == credentialsArr[foundIdx].password) {
      return true;
    }
    return false;
  }

  return false;
}

function findEmail(enteredEmail) {
  for (let i = 0; i < credentialsArr.length; i++) {
    if (enteredEmail == credentialsArr[i].email) {
      return i;
    }
  }
  return -1;
}

function logout() {
  localStorage.removeItem("activeSession");

  setTimeout(function () {
    window.location = "index.html";
  }, 1000);
}