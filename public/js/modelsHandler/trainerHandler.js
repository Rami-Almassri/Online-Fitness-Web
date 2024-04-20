// getting the top trainers
async function getTopTrainers(limit) {
    const trainers = await getThis("trainer", "top");
    const topTrainers = trainers.data.slice(0, limit);

    const topTrainersSection = document.getElementById("top-trainers");
    var topTrainersSectionContent = "";
    for(let i=0; i < topTrainers.length; i++){
        var trainerProfileLink = "profile.html?trainer=" + topTrainers[i]._id;
        // if a trainer didn't add a profile picture, we add a replacement
        if(!topTrainers[i].profilePicture) {
            topTrainers[i]["profilePicture"] = "assets/img/pp-avatar.jpg";
        } else {
            topTrainers[i]["profilePicture"] = "../backend/uploads/" + topTrainers[i]["profilePicture"];
        }

        topTrainersSectionContent += `
        <div class="trainer-box flex flex-col rounded-2xl lg:basis-48 md:basis-1/3 sm:basis-full">
            <div class="lg:w-48 lg:h-48 md:w-1/3 md:h-1/3 sm:h-full sm:w-full">
                <img src="${topTrainers[i]["profilePicture"]}" class="rounded-2xl h-full w-full object-fit object-center" />
            </div>
            <div class="flex flex-row p-3 pt-5 pb-5 text-2xl items-center">
                <div class="w-1/2 text-xl">
                    <a href="${trainerProfileLink}">
                        ${topTrainers[i].name}
                    </a>
                </div>
                <div class="flex flex-col justify-end items-end w-1/2 text-xl text-center">
                    <div class="text-2xl">${topTrainers[i].count}</div>
                    <div class="text-xl">Plan</div>
                </div>
            </div>
        </div>
        `;
    }

    topTrainersSection.innerHTML = topTrainersSectionContent;

    stopLoading();
}