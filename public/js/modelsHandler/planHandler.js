// getting the popular plans
async function getTopPlansSorted(limit) {
    const allPlansSorted = await getThis("plan", "allSorted");
    const plansSorted = allPlansSorted.data;
    return plansSorted.slice(0, limit);
}

// generate the plans section
function generatePlansSection(plans, plansSectionId, stopLoadingAfterDone) {
    const popPlansSection = document.getElementById(plansSectionId);
    if(!plans) {
        popPlansSection.innerHTML = "<h1>No Plans found</h1>";
        if(stopLoadingAfterDone) {
            stopLoading();
        }
        return;
    }

    var popPlansSectionContent = "";
    for(let i=0; i < plans.length; i++){
        const planRating = getPlanRating(plans[i].rating);

        if(plans[i].title.trim().length > 9) {
            plans[i].title = plans[i].title.substr(0, 9) + "...";
        }
        popPlansSectionContent += `
        <div class="plan-box flex flex-col rounded-2xl lg:basis-1/5 md:basis-1/3 sm:basis-full">
            <div class="flex justify-center">
                <img src="assets/img/plan-banner.jpg" class="rounded-2xl" />
            </div>
            <div class="flex flex-row p-3 pt-5 pb-5">
                <div class="w-2/3 text-xl">
                    <a href="plan.html?plan=${plans[i]._id}">${plans[i].title}</a>
                </div>
                <div class="flex flex-col justify-center items-center w-1/3 text-xl text-center">
                    <p>${planRating.rating}<span class="text-sm"> (${planRating.users}) </span><i class="fa-regular fa-star text-sm"></i></p>
                </div>
            </div>
            <div class="flex w-full">
                <a href="plan.html?plan=${plans[i]._id}" class="w-full bg-green-800 text-white p-3 text-2xl rounded-b-2xl">Open - £${plans[i].price}</a>
            </div>
        </div>
        `;
    }

    if(popPlansSectionContent.length == 0){
        popPlansSectionContent = `<p class="text-center">No plans</p>`;
    }

    popPlansSection.innerHTML = popPlansSectionContent;

    if(stopLoadingAfterDone) {
        stopLoading();
    }
}

// getting a certain plan
function generatePlanSection(plan, stopLoadingAfterDone=false) {
    // display plan's details
    const planDetails = ["title", "about", "price"];
    for(let i=0; i < planDetails.length; i++){
        document.getElementById("plan-"+planDetails[i]).innerText = plan[planDetails[i]];
    }

    // plan's rating
    const planRating = getPlanRating(plan.rating);
    document.getElementById("plan-rating").innerText = planRating.rating;
    document.getElementById("plan-ratings-users").innerText = planRating.users;

    // trainer's name
    document.getElementById("plan-trainer").innerHTML = `<a href="profile.html?trainer=${plan.trainer._id}">${plan.trainer.name}</a>`;

    // plan's index
    const planIndex = plan.index;
    const planIndexSection = document.getElementById("plan-index");
    var planIndexContent = "";
    for(var i=0; i < planIndex.length; i++) {
        planIndexContent += `<li>${planIndex[i].index} - ${planIndex[i].indexTitle}</li>`;
    }
    planIndexSection.innerHTML = planIndexContent;

    if(stopLoadingAfterDone) {
        stopLoading();
    }
}

// create the plan's content section
function generatePlanContentSection(content, stopLoadingAfterDone=false) {
    document.getElementById("plan-content-title").classList.remove("hidden");
    const contentSection = document.getElementById('plan-content');
    var contentSectionContent = "";
    for(let i=0; i < content.length; i++){
        contentSectionContent += `
        <div>
            <h1 class="text-xl mt-3">
                ${content[i].title}
            </h1>
            <p class="mt-2">
                ${content[i].content}
            </p>
        </div>`;
    }
    contentSection.innerHTML = contentSectionContent;

    if(stopLoadingAfterDone) {
        stopLoading();
    }
}

// extract the plan's rating
function getPlanRating(ratings) {
    var planRating = 0;
    var ratingSum = 0;
    var ratingsNum = ratings.length;
    var sumOfMaxRatingOfUser = ratingsNum * 5;
    ratings.forEach(rating => {
        ratingSum += rating.rating;
    });

    planRating = (ratingSum * 5) / (sumOfMaxRatingOfUser);
    if(isNaN(planRating)){ // if the rating is zero
        planRating = 0;
    } else if(planRating % 1 !== 0){ // if the rating is float
        planRating = planRating.toFixed(1);
    }

    return {"rating": planRating, "users": ratingsNum};
}

// rate a plan
function addRating(plan, memberId) {
    const planRatings = plan.rating;
    var alreadyRated = false;
    for(let i=0; i < planRatings.length; i++){
        if(planRatings[i]["user"] == memberId) {
            alreadyRated = true;
        }
    }
    // if he didn't rate it
    if(!alreadyRated){
        document.getElementById("plan-rating-section").classList.remove("hidden");
        document.getElementById("addRating").onclick = async () => {
            const rating = document.getElementById("rating-result").innerText;
            const rate = await putThis({"newRating": rating, "planId": plan._id}, "plan", "rate");
            location.reload();
        }
    }
}

// extract member's bought plans' info;
async function getMemberBoughtPlan(member) {
    var membersBoughtPlans = []
    for(var i=0; i < member.boughtPlans.length; i++){
        const plan = await getThis("plan", member.boughtPlans[i].planId);
        membersBoughtPlans.push(plan.data);
    }
    return membersBoughtPlans;
}