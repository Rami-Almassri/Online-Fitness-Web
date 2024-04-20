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
        fillPlanInputs(plan.data);

        // keep track of content's index
        var contentIndexLen = plan.data.index.length;
        document.getElementById("add-index-btn").onclick = () => {
            contentIndexLen += 1;
            appendContentIdx("", "", contentIndexLen);
        }

        document.getElementById("update-plan-btn").onclick = async () => {
            const planData = generatePlanReqBody(contentIndexLen);
            planData["planID"] = plan.data._id;
            const updatedPlan = await putThis(planData, "plan", "edit");
            if(updatedPlan.wasItASuccess){
                window.location = `plan.html?plan=${plan.data._id}`;
            }
        };
    } else {
        window.location = "404.html";
    }
});

function fillPlanInputs(plan) {
    const inputs = ["title", "about", "price"];
    for(let i=0; i < inputs.length; i++){
        document.getElementById(inputs[i]).value = plan[inputs[i]];
    }

    for(var i=0; i < plan.index.length; i++) {
        appendContentIdx(plan.content[i].content, plan.index[i].indexTitle, plan.index[i].index);
    }

    stopLoading();
}

// append index and content sections on-demand
function appendContentIdx(content, idxTitle, idx) {
    const newIdx = document.createElement("div");
    newIdx.innerHTML = `
    <div class="flex mt-3">
        <h1 class="index-box p-1 pl-4 pr-4 border border-black rounded-l-xl text-2xl">${idx}</h1>
        <input type="text" name="index-${idx}" id="index-${idx}" class="p-1 pl-2 pr-2 w-1/2 border-r border-y border-black rounded-r-xl bg-gray-300 focus:outline-none" value=${idxTitle}>
    </div>
    `;
    document.getElementById("index").appendChild(newIdx);
    
    const newContent = document.createElement("div");
    newContent.innerHTML = `
    <div class="flex flex-col w-full justify-center mt-7">
        <div id="content" class="content-header flex justify-center pt-2 pb-2 rounded-t-xl border border-black">Section #${idx}</div>
        <textarea name="content-${idx}" id="content-${idx}" rows="4" class="p-1 pl-2 pr-2 w-full border-x border-b focus:outline-none border-black rounded-b-xl bg-gray-300">${content}</textarea>
    </div>
    `;
    document.getElementById("content-section").appendChild(newContent);
}

// generate the plan request body which will be sent to the api
function generatePlanReqBody(contentIdx) {
    // getting the form inputs
    const inputs = ["title", "about", "price"];
    const planData = {};
    for(let i=0; i < inputs.length; i++){
        const inputValue = document.getElementById(inputs[i]).value
        planData[inputs[i]] = inputValue;
    }

    // taking the index and content data inputs
    const idx = [];
    const content = [];
    for(let i=1; i <= contentIdx; i++) {
        const idxValue = document.getElementById(`index-${i}`).value;
        const contentValue = document.getElementById(`content-${i}`).value;
        idx.push({"index": i, "indexTitle": idxValue});
        content.push({"title": idxValue, "content": contentValue});
    }
    
    planData["index"] = idx;
    planData["content"] = content;

    return planData;
}