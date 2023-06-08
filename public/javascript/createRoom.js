

document.querySelector("#input-nameRoom").addEventListener("keyup", (e) => {
    const regex = new RegExp(/^[a-zA-Z][a-zA-Z0-9]*$/)
    if (regex.test(e.target.value) == false) {

        e.target.value =  e.target.value.slice(0,-1)
        document.querySelector(".msgError").innerText = "Nome Invalido"
    }
    else{
        document.querySelector(".msgError").innerText = ""
    }
})

document.querySelectorAll("#input-nameRoom").forEach(inputName=>{
    inputName.addEventListener("paste", e=>{
      e.preventDefault()
      const pasteUser = e.clipboardData || window.clipboardData
      const regex = new RegExp(/^[a-zA-Z][a-zA-Z0-9]*$/);
      if (regex.test(pasteUser.getData('text/plain')) == false) {
        inputName.value=""
      } 
      else{
        inputName.value= pasteUser.getData('text/plain')
      }
    })
  })