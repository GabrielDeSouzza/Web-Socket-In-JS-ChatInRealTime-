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
        const divPermissionUser = element.parentNode.parentNode.querySelector(".div-usersManager")
        divPermissionUser.style.display = "flex"
        element.remove()
        
    })
})

