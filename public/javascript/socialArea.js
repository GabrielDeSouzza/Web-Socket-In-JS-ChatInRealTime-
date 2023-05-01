if (document.querySelector(".create-room")) {
    document.querySelector(".create-room").addEventListener("click", (e) => {
        e.preventDefault()
        sendData({
            url: "/createRoom"
        })
    })
}

document.querySelector("#btn-logout").addEventListener("click", (e) => {
    e.preventDefault()
    sendData({
        url: "/logout"
    })
})
document.querySelector("#btn-editar").addEventListener("click", (e) => {
    e.preventDefault()
    sendData({
        url: "/editProfile",
        method: "GET"
    })
})
if (document.querySelector("#btn-cadastrar-usuarios")) {
    document.querySelector("#btn-cadastrar-usuarios").addEventListener("click", (e) => {
        e.preventDefault()
        sendData({
            url: "/cadastro",
            method: "GET"
        })
    })
}

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