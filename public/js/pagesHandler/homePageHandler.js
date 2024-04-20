// check if user is already in
window.addEventListener("DOMContentLoaded", async function() {
    const allCookies = getCookies();
    // the user hans't logged in yet
    if(!allCookies["user"]){
        document.getElementById("nav-login").innerHTML = `<a href="login.html">Login</a>`;
        document.getElementById("nav-sign-out").classList.add("hidden");
        document.getElementById("join-us-btn").classList.remove("hidden");
    }

    // get top 4 plans
    const topPlans = await getTopPlansSorted(4);
    generatePlansSection(topPlans, "pop-plans", stopLoadingAfterDone=false);
    // top 5 trainers
    getTopTrainers(5);

    // handle search request
    document.getElementById("plan-search-btn").onclick = () => {
        const searchQuery = document.getElementById("plan-search-input").value;
        window.location = "plans.html?search="+searchQuery;
    };
});