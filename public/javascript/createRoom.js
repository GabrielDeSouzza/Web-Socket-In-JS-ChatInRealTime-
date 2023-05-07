

document.querySelector("#input-nameRoom").addEventListener("keyup", (e) => {
    const regex = new RegExp(/^[a-zA-Z][a-zA-Z0-9]*$/)
    if (regex.test(e.target.value) == false) {

        e.target.value =  e.target.value.slice(0,-1)
        document.querySelector(".msgError").innerText = "Caractere Invalido"
    }
    else{
        document.querySelector(".msgError").innerText = ""
    }
})