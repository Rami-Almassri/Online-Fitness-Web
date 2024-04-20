// check if user is already in
window.addEventListener("DOMContentLoaded", function() {
    const allCookies = getCookies();
    if(allCookies["user"]){
        window.location = "home.html";
    } else {
        stopLoading();
    }
});

// on login
async function login() {
    // getting the form inputs
    const inputs = ["email", "password", "role"];
    const userData = {};
    var userRole = "Member";
    for(let i=0; i < inputs.length; i++){
        if(inputs[i] == "role"){
            userRole = document.querySelector('input[name="role"]:checked').value;
            console.log(userRole)
        } else {
            inputValue = document.getElementById(inputs[i]).value;
            userData[inputs[i]] = inputValue;
        }
    }

    console.log(userData);
    
    // check if user exists
    var userExists = await postThis(userData, userRole, "login");

    const errorMsg = document.getElementById("errorMessage");
    const successMessage = document.getElementById("successMessage");
    if(userExists["wasItASuccess"]) {
        successMessage.classList.remove("hidden");
        errorMsg.classList.add("hidden");
        successMessage.innerText = "You have entered successfully";
        setUserToken(userExists["token"], userRole, 10);
        window.location = "home.html";
    } else {
        errorMsg.classList.remove("hidden");
        errorMsg.classList.add("block");
        errorMsg.innerText = userExists["errorMessage"];
    }
}