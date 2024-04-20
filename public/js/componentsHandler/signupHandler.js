// check if user is already in
window.addEventListener("DOMContentLoaded", function() {
    const allCookies = getCookies();
    if(allCookies["user"]){
        window.location = "home.html";
    } else {
        stopLoading();
    }
});

// toggle sign-up as
const asMember = document.getElementById("as-member");
const asTrainer = document.getElementById("as-trainer");
var userRoleChoice = "member";

asMember.onclick = () => {
    asMember.classList.remove("text-green-800");
    asMember.classList.add("bg-green-800", "text-gray-300");

    asTrainer.classList.add("bg-gray-300", "text-green-800");
    asTrainer.classList.remove("bg-green-800");

    userRoleChoice = "member";
}

asTrainer.onclick = () => {
    asMember.classList.add("bg-gray-300", "text-green-800");
    asMember.classList.remove("bg-green-800");

    asTrainer.classList.remove("text-green-800");
    asTrainer.classList.add("bg-green-800", "text-gray-300");

    userRoleChoice = "trainer";
}

// on sign-up
async function signup() {
    // getting the form inputs
    const inputs = ["name", "username", "email", "password"];
    const userData = {};
    for(let i=0; i < inputs.length; i++){
        inputValue = document.getElementById(inputs[i]).value
        userData[inputs[i]] = inputValue;
    }
    
    // push user's data to the database
    var userHasRegister = await postThis(userData, userRoleChoice, "");

    const errorMsg = document.getElementById("errorMessage");
    const successMessage = document.getElementById("successMessage");
    if(userHasRegister["wasItASuccess"]) {
        successMessage.classList.remove("hidden");
        errorMsg.classList.add("hidden");
        successMessage.innerText = "You have joined us successfully";
        setUserToken(userHasRegister["token"], userRoleChoice, 10);
        window.location = "home.html";
    } else {
        errorMsg.classList.remove("hidden");
        errorMsg.classList.add("block");
        errorMsg.innerText = userHasRegister["errorMessage"];
    }
}