document.querySelector(".create-room").addEventListener("click",(e)=>{
    e.preventDefault()
    sendData({
        url: "/createRoom"
    })
})
document.querySelector("#btn-logout").addEventListener("click",(e)=>{
    e.preventDefault()
    sendData({
        url: "/logout"
    })
})

document.querySelector(".room-created").addEventListener("click",(e)=>{
    e.preventDefault()
    const data = {
        nameUser: e.currentTarget.querySelector("#nameUser").textContent,
        nameRoom: e.currentTarget.querySelector(".sp-name-room").textContent
    }
    sendData({
        url: "/socilArea",
        room: data.room,
        username: data.nameUser
    })
})

function sendData(data) {
    let form = $(`<form action="${data.url}" method="POST"> 
        <input type="text" name="room" value=${data.room}> +
        <input type="text" name="username" value=${data.username}>` +
        '</form>'
    )

    $('body').append(form)
    form.submit()
}