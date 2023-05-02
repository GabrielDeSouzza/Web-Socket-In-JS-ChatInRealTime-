/*document.querySelector(".room").addEventListener("submit", (e) => {
    e.preventDefault()
    console.log(e.target.querySelector("#inp-hidden"))
    
})*/

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