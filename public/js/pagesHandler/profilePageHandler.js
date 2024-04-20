window.addEventListener("DOMContentLoaded", async function() {
    const allCookies = getCookies();
    // the user hasn't logged in yet
    if(!allCookies["user"]){
        document.getElementById("nav-login").innerHTML = `<a href="login.html">Login</a>`;
        document.getElementById("nav-sign-out").classList.add("hidden");
    }

    const urlParams = getJsonFromUrl(window.location.search);
    var explorePlansLink = "";
    // trainer profile
    const plansTitle = document.getElementById("profile-plans-title");
    if(urlParams.trainer || allCookies["role"] == "trainer"){
        const trainer = await getThis("trainer", urlParams.trainer ?? "me");
        generateTrainerProfile(trainer.data, urlParams.trainer ?? "me");
        plansTitle.innerText = "Plans";
        generatePlansSection(trainer.data.plans, "profile-plans", stopLoadingAfterDone=true);
        explorePlansLink = "plans.html?trainer=" + trainer.data._id;
    }
    // member profile
    else {
        const currentUser = await getThis("member", "me");
        if(currentUser.wasItASuccess){
            generateMemberProfile(currentUser.data.member);
            plansTitle.innerText = "Bought plans";
            var membersBoughtPlans = await getMemberBoughtPlan(currentUser.data.member);
            generatePlansSection(membersBoughtPlans, "profile-plans", stopLoadingAfterDone=true);
            explorePlansLink = "plans.html?boughtPlans=" + currentUser.data.member._id;
        }
        // it's not a member or a trainer logged in
        else {
            window.location = "404.html";
        }
    }

    document.getElementById("explore-plans").innerHTML = `
        <a href="${explorePlansLink}">explore plans</a>
    `;
});

// profile data
function generateTrainerProfile(trainer, route) {
    const profileDataBox = document.getElementById("profile-data-box");
    // check if the user has an about section. if he hasn't, we add a replacement.
    if(!trainer.about){
        trainer["about"] = "-";
    }

    // check if the user has a profile picture. if he hasn't, we add a replacement.
    if(!trainer.profilePicture) {
        trainer["profilePicture"] = "assets/img/pp-avatar.jpg";
    } else {
        trainer["profilePicture"] = "../backend/uploads/" + trainer["profilePicture"];
    }

    var changePictureSection = "";
    var editTrainerInfo = "";
    // if it's a user browsing his profile, we give him the choice to upload a profile picture and edit his about
    if(route == "me") {
        changePictureSection = generateChangeProfilePicture();
        editTrainerInfo = `<a href="editUserInfo.html" class="text-green-800">Edit About</a>`;
    }

    profileDataBox.innerHTML = `
    <div class="flex lg:w-1/4 md:w-1/2 sm:w-full">
        <div>
            <img src="${trainer.profilePicture}" class="rounded-2xl w-full">
            ${changePictureSection}
        </div>
    </div>
    <div class="flex lg:w-3/4 md:w-1/2 sm:w-full lg:pl-9 pt-5">
        <div class="flex w-full flex-col">
            <div>
                <h1 class="text-3xl">${trainer.name}</h1>
                <h1 class="text-md">@${trainer.username}</h1>
            </div>
            <div class="lg:pt-7 md:pt-8 sm:pt-4">
                <p>About me</p>
                <h1 class="text-xl w-3/4">
                    ${trainer.about}
                </h1>
                ${editTrainerInfo}
            </div>
        </div>
    </div>`;
}

// member profile
function generateMemberProfile(member) {
    const profileDataBox = document.getElementById("profile-data-box");
        // check if the user has a goal section. if he hasn't, we add a replacement.
    if(!member.goal) {
        member["goal"] = {"currentWeight": "-", "weightGoal": "-", "goal": "-"};
    }
    // check if the user has a profile picture. if he hasn't, we add a replacement.
    if(!member.profilePicture) {
        member["profilePicture"] = "assets/img/pp-avatar.jpg";
    } else {
        member["profilePicture"] = "../backend/uploads/" + member["profilePicture"];
    }

    const changePictureSection = generateChangeProfilePicture();

    profileDataBox.innerHTML = `
    <div class="flex lg:w-1/4 md:w-1/2 sm:w-full">
        <div class="">
            <img src="${member.profilePicture}" class="rounded-2xl w-full">
            ${changePictureSection}
        </div>
    </div>
    <div class="flex lg:w-3/4 md:w-1/2 sm:w-full lg:pl-9 pt-5">
        <div class="flex w-full flex-col">
            <div>
                <h1 class="text-3xl">${member.name}</h1>
                <h1 class="text-md">@${member.username}</h1>
            </div>
            <div class="lg:pt-7 md:pt-8 sm:pt-4">
                <div class="flex text-xl">
                    <div>
                        <h1>Current Weight</h1>
                        <h1>Goal Weight</h1>
                        <h1>Goal</h1>
                        <a href="editUserInfo.html" class="text-green-800">Edit Goal</a>
                    </div>
                    <div class="pl-5">
                        <h1>${member.goal.currentWeight} kg</h1>
                        <h1>${member.goal.weightGoal} kg</h1>
                        <h1>${member.goal.goal}</h1>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

// create the section for uploading a profile picture
function generateChangeProfilePicture() {
    const role = getCookies()["role"];
    return `
    <div class="flex flex-col justify-content w-full items-center">
        <label for="${role}ProfilePicture" class="border border-2 border-black inline-block p-2 cursor-pointer mt-2 rounded-2xl">Change<label>
        <input type="file" name="${role}ProfilePicture" id="${role}ProfilePicture" class="hidden" onchange="submitProfilePicture()">
    </div>`;
}

// hit the database to update the profile picture
async function submitProfilePicture() {
    const role = getCookies()["role"];
    const pic = document.getElementById(role+"ProfilePicture").files[0];
    const formData = new FormData();
    formData.append(role+"ProfilePicture", pic);
    await uploadThis(formData, role, "uploadProfilePicture");
    window.reload();
}