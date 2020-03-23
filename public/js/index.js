function submitForm() {
    let user = document.getElementById('user_name').value;
    let message = document.getElementById('message').value;
    let sex = document.querySelector('input[name="sex"]:checked').value;

    let xhr = new XMLHttpRequest();

    xhr.open('POST', 'http://localhost:8081/add-message', false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ "user": user, "message": message, "sex": sex }));

    if (xhr.status != 200) {
        alert(xhr.status + ': ' + xhr.statusText);
    } else {
        document.getElementById('f1').reset();
        let responseServer = JSON.parse(xhr.responseText);
        addNewMessage(responseServer);
    }
    
    return false;
}

function addNewMessage(responseServer) {
    
    let blockUserTR = document.createElement("tr");
    blockUserTR.setAttribute('class','user');
    let blockUserAvatarTD = document.createElement("td");
    blockUserAvatarTD.setAttribute('rowspan','2');
    blockUserAvatarTD.setAttribute('class','text');

    let blockImgUserTD = document.createElement("img");
    blockImgUserTD.setAttribute('class','avatar');
    blockImgUserTD.setAttribute("src", "imges/" + responseServer.sex + ".png")

    let blockUserNameTd = document.createElement("td");
    blockUserNameTd.setAttribute('class','name');
    let blockSpanTime = document.createElement("span");
    blockSpanTime.setAttribute('class','time');
    
    let blockMessageTR = document.createElement("tr");
    //let blockEmptyTD = document.createElement("td");
    let blockMessageTD = document.createElement("td");
    let blockMessageDiv = document.createElement("div");
    blockMessageDiv.setAttribute('class', 'ugolochek');

    blockSpanTime.append("("+responseServer.time+")");

    let blockEmptyTR = document.createElement("tr");
    blockEmptyTR.setAttribute('class', 'empty')

    blockUserNameTd.append(responseServer.user);
    blockUserNameTd.append(blockSpanTime);
    blockMessageDiv.append(responseServer.message);
    blockMessageTD.append(blockMessageDiv);

    blockUserAvatarTD.append(blockImgUserTD);
    blockUserTR.append(blockUserAvatarTD);
    blockUserTR.append(blockUserNameTd);
    
    blockMessageTR.append(blockMessageTD);

    document.getElementById("reviews").appendChild(blockUserTR);
    document.getElementById("reviews").appendChild(blockMessageTR);
    document.getElementById("reviews").appendChild(blockEmptyTR);
}

function loadCommemts() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:8081/get-messages', false);
    xhr.send();

    if (xhr.status != 200) {
        alert(xhr.status + ': ' + xhr.statusText);
    } else {
        let responseServer = JSON.parse(xhr.responseText);
        responseServer.forEach(function (value, index) {
            addNewMessage(value);
        })
    }
}

document.addEventListener('DOMContentLoaded', function () {
    loadCommemts();
})

function checkParams(){
    let user_name = document.getElementById('user_name').value;
    let message = document.getElementById('message').value;

    if(user_name != '' && message != ''){
        document.forms.f1.submit.disabled = false;
    } else {
        document.forms.f1.submit.disabled = true;
    }

}