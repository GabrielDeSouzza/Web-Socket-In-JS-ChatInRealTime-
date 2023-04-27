
function CreateSectionRooms(rooms) {
    const div = document.createElement("div")
    div.setAttribute("class", "div-room")
    const spanUserCreate = document.createElement("span")
    spanUserCreate.setAttribute("class", "user-crete-room")
    spanNameRoom.textContent = rooms.username

    const spanNameRoom = document.createElement("span")
    spanNameRoom.setAttribute("class", "sp-name-room")
    spanNameRoom.textContent = rooms.nameRoom

    const pDescription = document.createElement("p")
    pDescription.setAttribute("class", "p-description-room")
    pDescription.textContent = rooms.Description

    div.appendChild(spanUserCreate)
    div.appendChild(spanNameRoom)
    div.appendChild(pDescription)
    document.querySelector(".lateral-menu").appendChild(div)
}

function sendData(data) {
    
    let form = $(`<form method="post"> 
        <input type="text" name="room" value=${data.room}> +
        <input type="text" name="username" value=${data.username}>` +
        '</form>'
    )

    $('body').append(form)
    form.submit()
}