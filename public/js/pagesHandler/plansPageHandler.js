// check if user is already in
window.addEventListener("DOMContentLoaded", async function() {
    const allCookies = getCookies();
    // the user hans't logged in yet
    if(!allCookies["user"]){
        document.getElementById("nav-login").innerHTML = `<a href="login.html">Login</a>`;
        document.getElementById("nav-sign-out").classList.add("hidden");
    }

    const urlParams = getJsonFromUrl(window.location.search);
    var plansTitle = "";
    var plans = [];
    // we are using the page to display the users' bought plans
    if(urlParams.boughtPlans) {
        plansTitle = "Your bought plans";
        const member = await getThis("member", "me");
        plans = await getMemberBoughtPlan(member.data.member);
    }
    // we are using the page to display a trainer's plans
    else if(urlParams.trainer) {
        const trainer = await getThis("trainer", urlParams.trainer);
        plansTitle = trainer.data.name + "'s plans";
        plans = trainer.data.plans;
    }
    // we are using the page to display the search results
    else if(urlParams.search) {
        plansTitle = "Search results for " + urlParams.search;
        const searchResults = await getThis("plan", "search/" + urlParams.search);
        plans = searchResults.data;
    }
    // we are using the page to display the top trainers
    else {
        plansTitle = "Top Plans";
        plans = await getTopPlansSorted(50);

        // if it's a trainer logged in, we give him the option to create a plan
        if(allCookies["role"] == "trainer"){
            const createAPlanSection = document.getElementById("create-a-plan-section");
            createAPlanSection.classList.remove("hidden");
            createAPlanSection.classList.add("block");
            createAPlanSection.onclick = () => {
                window.location = "createPlan.html";
            };
        }
    }

    // display the plans
    generatePlansSection(plans, "all-plans", stopLoadingAfterDone=true);

    // edit the page's title
    document.getElementById("plans-title").innerText = plansTitle;
});