// check if user is already in
window.addEventListener("DOMContentLoaded", function() {
    const allCookies = getCookies();
    // only a trainer can access this page
    if(allCookies["role"] != "trainer") {
        window.location = "404.html";
    } else {
        document.getElementById("nav-login").innerHTML = `<a href="login.html">Login</a>`;
        document.getElementById("nav-sign-out").classList.add("hidden");
        stopLoading();
    }

    var contentIndexLen = 1; // to check how many content blocks user has entered
    document.getElementById("add-index-btn").onclick = () => {
        contentIndexLen += 1;
        appendContentIdx(contentIndexLen);
    }

    // create plan
    document.getElementById("create-plan-btn").onclick = async () => {
        const planData = generatePlanReqBody(contentIndexLen);
        const newPlanAdded = await postThis(planData, "plan", "create");;
        if(newPlanAdded.wasItASuccess){
            window.location = "plans.html";
        }
    };

    
});

// append index and content sections on-demand
function appendContentIdx(idx) {
    const newIdx = document.createElement("div");
    newIdx.innerHTML = `
    <div id="idx-section-${idx}" class="flex mt-3">
        <h1 id="idx-number-${idx}" class="index-box p-1 pl-4 pr-4 border border-black rounded-l-xl text-2xl">${idx}</h1>
        <input type="text" name="index-${idx}" id="index-${idx}" class="p-1 pl-2 pr-2 w-1/2 border-r border-y border-black rounded-r-xl bg-gray-300 focus:outline-none">
    </div>
    `;
    document.getElementById("index").appendChild(newIdx);
    
    const newContent = document.createElement("div");
    newContent.innerHTML = `
    <div id="content-section-${idx}" class="flex flex-col w-full justify-center mt-7">
        <div id="content" class="content-header flex justify-center pt-2 pb-2 rounded-t-xl border border-black">Section #${idx}</div>
        <textarea name="content-${idx}" id="content-${idx}" rows="4" class="p-1 pl-2 pr-2 w-full border-x border-b focus:outline-none border-black rounded-b-xl bg-gray-300"></textarea>
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