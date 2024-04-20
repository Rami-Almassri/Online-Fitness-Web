// check if user is already in
window.addEventListener("DOMContentLoaded", async function() {
    const allCookies = getCookies();
    // the user hasn't logged in yet
    if(!allCookies["user"]) {
        document.getElementById("nav-login").innerHTML = `<a href="login.html">Login</a>`;
        document.getElementById("nav-sign-out").classList.add("hidden");
    }

    const urlParams = getJsonFromUrl(window.location.search);
    // a plan page
    if(urlParams.plan){
        const plan = await getThis("plan", urlParams.plan);
        generatePlanSection(plan.data);
        document.title = plan.data.title;
        // it's a member browsing the site
        if(allCookies["role"] == "member") {
            // check if the member already bought the plan
            const member = await getThis("member", "me");
            console.log(member);
            const memberPlans = member.data.member.boughtPlans;
            var boughtPlans = [];
            for(let i=0; i < memberPlans.length; i++){
                boughtPlans.push(memberPlans[i].planId);
            }
            // member already bought the plan
            if(boughtPlans.indexOf(plan.data._id) > -1){
                document.getElementById("buy-plan-btn").classList.add("hidden");
                addRating(plan.data, member.data.member._id);
                generatePlanContentSection(plan.data.content, stopLoadingAfterDone=true);
            }
            // member doesn't have the plan
            else {
                document.getElementById("buy-plan-btn").onclick = async () => {
                    const session = await postThis({"id": urlParams.plan}, "buyPlan", "createSession");
                    if(session.wasItASuccess) {
                        window.location = session.data.url;
                    }
                };
                stopLoading();
            }
        // it's a trainer browsing the site
        } else if(allCookies["role"] == "trainer") {
            const trainer = await getThis("trainer", "me");
            document.getElementById("buy-plan-btn").classList.add("hidden");
            // if this plan was created by the trainer who is logged in, we let him explore the content
            if(trainer.data._id == plan.data.trainer._id) {
                document.getElementById("options-for-trainer").innerHTML = `
                <a href="editPlan.html?plan=${plan.data._id}" id="edit-plan-btn" class="bg-blue-800 p-5 pl-8 pr-8 text-gray-100 text-2xl text-center rounded-2xl transition ease-in-out delay-50 hover:bg-blue-700">
                    Edit
                </a>
                <a href="deletePlan.html?plan=${plan.data._id}" id="delete-plan-btn" class="bg-red-800 p-5 pl-8 pr-8 text-gray-100 text-2xl text-center rounded-2xl transition ease-in-out delay-50 hover:bg-red-700">
                    Delete
                </a>`;
                generatePlanContentSection(plan.data.content, stopLoadingAfterDone=true);
            } else {
                document.getElementById("buy-plan-btn").classList.add("hidden");
                stopLoading();
            }
        } else {
            document.getElementById("buy-plan-btn").classList.add("hidden");
            stopLoading();
        }
    }
    // a successful plan payment page
    else if(urlParams.boughtPlan) {
        const plan = await getThis("plan", urlParams.boughtPlan);
        await postThis({"planId": plan.data._id}, "member", "addBoughtPlan");
        document.getElementById("successful-plan-title").innerHTML = `<a href="plan.html?plan=${plan.data._id}">${plan.data.title}</a>`;
        stopLoading();
    }
    // it's not a successful plan payment page or a plan page
    else {
        window.location = "404.html";
    }
});