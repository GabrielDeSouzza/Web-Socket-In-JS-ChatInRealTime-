function clickButtomAction(button, url,methodIsGet){
    if (document.querySelector(button)) {
        document.querySelector(button).addEventListener("click", (e) => {
            e.preventDefault()
            sendData({
                url: url,
                method: methodIsGet
            })
        })
    }
}

clickButtomAction(".create-room", "/createRoom")
clickButtomAction("#btn-logout","/logout")
clickButtomAction("#btn-editar","/editProfile","GET")
clickButtomAction("#btn-cadastrar-usuarios","/cadastro","GET")
clickButtomAction("#btn-user-manager","/usersManager","GET")
clickButtomAction("#btn-rooms-manager", "/roomsManager", "GET")

const rooms = document.querySelectorAll(".room-created")
rooms.forEach((room) => {
    room.addEventListener("click", (e) => {
        console.log(e.currentTarget.querySelector(".sp-name-room"))
        data = {
            username: e.currentTarget.querySelector("#nameUser").textContent,
            room: e.currentTarget.querySelector(".sp-name-room").textContent,
            url: "/socialArea"

        }
        console.log(data)
        sendData(data)
    })
})

function sendData(data) {
    let form = $(`<form action="${data.url}" method="${data.method ? data.method : "POST"}"> 
        <input type="text" name="room" value=${data.room}> +
        <input type="text" name="username" value=${data.username}>` +
        '</form>'
    )

    $('body').append(form)
    form.submit()
}