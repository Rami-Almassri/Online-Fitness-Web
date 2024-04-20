// check if user is already in
window.addEventListener("DOMContentLoaded", async function() {
    const allCookies = getCookies();
    // a non-user can't access this page
    if(!allCookies["user"] && allCookies["role"] != "trainer"){
        windows.location = "404.html";
    }

    const urlParams = getJsonFromUrl(window.location.search);
    // a plan page
    if(urlParams.plan) {
        const plan = await getThis("plan", urlParams.plan);
        document.getElementById("plan-title").innerText = plan.data.title;
        document.getElementById("delete-plan-btn").onclick = async () => {
            const deletedPlan = await deleteThis(plan.data._id, "plan", "delete");
            console.log(deletedPlan);
            if(deletedPlan.wasItASuccess){
                window.location = `plans.html`;
            }
        };
        stopLoading();
    } else {
        window.location = "404.html";
    }
});