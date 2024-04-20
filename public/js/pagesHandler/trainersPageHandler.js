// check if user is already in
window.addEventListener("DOMContentLoaded", async function() {
    const allCookies = getCookies();
    // if the user hasn't logged in yet
    if(!allCookies["user"]){
        document.getElementById("nav-login").innerHTML = `<a href="login.html">Login</a>`;
        document.getElementById("nav-sign-out").classList.add("hidden");
    }

    // get top 20 trainers
    getTopTrainers(50);
});