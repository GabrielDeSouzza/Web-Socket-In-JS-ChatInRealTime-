document.querySelectorAll(".btn-alterar").forEach(element => {
    element.addEventListener("click", (e) => {
        e.target.parentNode.querySelector("#inp-hidden").value = 'alterar'
    })
})

document.querySelectorAll(".btn-excluir").forEach(element => {
    element.addEventListener("click", (e) => {
        e.target.parentNode.querySelector("#inp-hidden").value = 'excluir'
    })
})

document.querySelectorAll(".btn-permisionUsers").forEach(element =>{
    element.addEventListener("click", async (e) => {
        element.parentNode.parentNode.appendChild(await createDivUsersAcess())
        element.remove()
        
    })
})


async function  createDivUsersAcess(){
    const div = document.createElement("div")
    div.setAttribute("class","acess-users")
    const span = document.createElement("span")
    div.appendChild(span)
    span.innerText= "Selecione os usuarios que terão acesso a sala"
    const users = await fetch("roomsManager/getUsers")
        .then(async response=> await response.json())
            .then(json=> JSON.parse(json))
    users.forEach(user=>{
        const input = document.createElement("input")
        input.type="checkosnhfn"
    })

    return div
}
