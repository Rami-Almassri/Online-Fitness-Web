// check if user is already in
window.addEventListener("DOMContentLoaded", async function() {
    const allCookies = getCookies();
    // a non-user can't access this page
    if(!allCookies["user"]){
        windows.location = "404.html";
    }

    // if it's a member, let him edit his goal
    if(allCookies["role"] == "member") {
        document.getElementById("member-edit-goal").classList.remove("hidden");
        document.getElementById("member-edit-goal").classList.add("block");

        editUserInfo(["currentWeight", "weightGoal", "goal"], "member", "editGoal");

    }
    // if it's a trainer, let him edit his about (bio)
    else if(allCookies["role"] == "trainer") {
        document.getElementById("trainer-edit-about").classList.remove("hidden");
        document.getElementById("trainer-edit-about").classList.add("block");

        editUserInfo(["about"], "trainer", "editAbout");
    }
});

// get the updated fields and push to the database
function editUserInfo(dataToBeUpdated, role, route) {
    document.getElementById("save-new-info").onclick = async () => {
        var updatedData = {};
        for(var i=0; i < dataToBeUpdated.length; i++){
            updatedData[dataToBeUpdated[i]] = document.getElementById(dataToBeUpdated[i]).value;
        }
        // Update the database
        const updateDB = await putThis(updatedData, role, route);
        if(updateDB.wasItASuccess) {
            window.location = "profile.html";
        } else {
            window.location = "404.html";
        }
    }
}