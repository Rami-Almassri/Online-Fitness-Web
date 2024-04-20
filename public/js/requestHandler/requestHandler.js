// retrieve all cookies
var getCookies = function(){
    var pairs = document.cookie.split(";");
    var cookies = {};
    for (var i=0; i<pairs.length; i++){
        var pair = pairs[i].split("=");
        cookies[(pair[0]+'').trim()] = unescape(pair.slice(1).join('='));
    }
    return cookies;
}

// extract url parameters
function getJsonFromUrl(url) {
    var query = url.substr(1);
    var result = {};
    query.split("&").forEach(function(part) {
        var item = part.split("=");
        result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
}

// set user token
function setUserToken(token, role, daysToExpire) {
    const d = new Date();
    d.setTime(d.getTime() + (daysToExpire*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie =  "user=" + token + ";" + expires + ";path=/;";
    document.cookie =  "role=" + role + ";" + expires + ";path=/";
}

// Sign-out
document.getElementById("sign-out").onclick = () => {
    document.cookie =  "user=" + getCookies()["user"] + ";path=/;Max-Age=0;";
    document.cookie =  "role=" + getCookies()["role"] + ";path=/;Max-Age=0;";
    window.location = "signup.html";
};

// Handle POST requests
async function postThis(dataToBePosted, model, route) {
    let wasItASuccess = false;
    let errorMessage = "";
    let token = "";
    let responseData = {};
    var headers = { "Content-Type": "application/json" };
    var protectedWithTokens = ["create", "createSession", "addBoughtPlan"]
    if(protectedWithTokens.indexOf(route) > -1){
        headers = {...headers, 'Authorization': ("Bearer " + getCookies()["user"]) };
    }
    if(route == "uploadProfilePicture") {
        headers["Content-Type"] = "multipart/form-data";
    }
    await fetch(`http://localhost:8136/api/${model}/${route}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(dataToBePosted)
    })
    .then(async res => {
        if(res.ok) return await res.json();

        // an error occurred
        const err = await res.json();
        errorMessage = err.message;
        wasItASuccess = false;
    }).then(data =>  {
        if(data){
            wasItASuccess = true;
            if(data.token) token = data.token;
            responseData = data;
        }
    });

    return { "wasItASuccess": wasItASuccess, "errorMessage": errorMessage, "token": token, "data": responseData };
}

// Handle GET requests
async function getThis(model, route) {
    let wasItASuccess = false;
    let errorMessage = "";
    let returnedData = {}
    var headers = {};
    if(route == "me"){
        headers = { 'Authorization': ("Bearer " + getCookies()["user"]) };
    }
    await fetch(`http://localhost:8136/api/${model}/${route}/`, {
        method: 'GET',
        headers,
    })
    .then(async res => {
        if(res.ok) return await res.json();

        // an error occurred
        const err = await res.json();
        errorMessage = err.message;
        wasItASuccess = false;
    }).then(data =>  {
        if(data){
            wasItASuccess = true;
            returnedData = data
        }
    });

    return { "wasItASuccess": wasItASuccess, "errorMessage": errorMessage, "data": returnedData };
}

// Handle PUT requests
async function putThis(dataToBeUpdated, model, route) {
    let wasItASuccess = false;
    let errorMessage = "";
    let returnedData = {};
    await fetch(`http://localhost:8136/api/${model}/${route}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            'Authorization': ("Bearer " + getCookies()["user"])
        },
        body: JSON.stringify(dataToBeUpdated)
    })
    .then(async res => {
        if(res.ok) return await res.json();

        // an error occurred
        const err = await res.json();
        errorMessage = err.message;
        wasItASuccess = false;
    }).then(data =>  {
        if(data){
            wasItASuccess = true;
            returnedData = data;
        }
    });

    return { "wasItASuccess": wasItASuccess, "errorMessage": errorMessage, "data": returnedData };
}

// Handle DELETE requests
async function deleteThis(id, model, route) {
    let wasItASuccess = false;
    let errorMessage = "";
    var headers = { 'Authorization': ("Bearer " + getCookies()["user"]) };
    await fetch(`http://localhost:8136/api/${model}/${route}/${id}`, {
        method: 'DELETE',
        headers,
    })
    .then(async res => {
        if(res.ok) return await res.json();

        // an error occurred
        const err = await res.json();
        errorMessage = err.message;
        wasItASuccess = false;
    }).then(data =>  {
        if(data){
            wasItASuccess = true;
            returnedData = data
        }
    });

    return { "wasItASuccess": wasItASuccess, "errorMessage": errorMessage };
}

// Handle upload request
async function uploadThis(dataToBeUploaded, model, route) {
    let wasItASuccess = false;
    let errorMessage = "";
    let responseData = {};
    await fetch(`http://localhost:8136/api/${model}/${route}`, {
        method: 'POST',
        headers: {
            'Authorization': ('Bearer ' + getCookies()['user']),
        },
        body: dataToBeUploaded,
    })
    .then((res) => {
        responseData = res
        if(responseData) {
            wasItASuccess = true;
        }
    })
    .catch((err) => ("Error occured", errMessage = err));

    return { "wasItASuccess": wasItASuccess, "errorMessage": errorMessage, "data": responseData };
}