document.querySelectorAll(".btn-alterar").forEach((element) => {
  element.addEventListener("click", (e) => {
    e.target.parentNode.querySelector("#inp-hidden").value = "alterar";
  });
});

document.querySelectorAll(".btn-excluir").forEach((element) => {
  element.addEventListener("click", (e) => {
    e.target.parentNode.querySelector("#inp-hidden").value = "excluir";
  });
});

document.querySelectorAll(".btn-permisionUsers").forEach((element) => {
  element.addEventListener("click", async (e) => {
    const divPermissionUser =
      element.parentNode.parentNode.querySelector(".div-usersManager");
    divPermissionUser.style.display = "flex";
    element.remove();
  });
});

document.querySelectorAll(".room").forEach((room) => {
  room.querySelector("#name-room").addEventListener("keyup", (e) => {
    const regex = new RegExp(/^[a-zA-Z][a-zA-Z0-9]*$/);
    if (regex.test(e.target.value) == false) {
      room.querySelector(".name-erro").style.display = 'block';
      e.target.value = e.target.value.slice(0, -1);
    } else {
       room.querySelector(".name-erro").style.display = "none";
    }
  });
  room.addEventListener("submit",(e)=>{
    e.preventDefault()
    const formData =  new FormData()
    const checkedDel=  Array.from(e.currentTarget.querySelectorAll("input[name='usersMemberDel']"))
    .map(x=>x.value)
    const checkedAdd=  Array.from(e.currentTarget.querySelectorAll("input[name='usersMemberAdd']"))
    .map(x=>x.value)
    const nameRoom = e.currentTarget.querySelector("input[name='nameRoom']").value
    const oldName = e.currentTarget.querySelector("input[name='oldName']").value
    const action = e.currentTarget.querySelector("input[name='action']").value
    const description = e.currentTarget.querySelector("textarea[name='description']").value
    formData.append("usersMemberDel", checkedDel)
    formData.append("usersMemberAdd", checkedAdd)
    formData.append("nameRoom",nameRoom)
    formData.append("oldName", oldName)
    formData.append("action",action)
    formData.append("description", description)

    const xmlRequest = new XMLHttpRequest()
    const encodedData = new URLSearchParams(formData).toString();

    xmlRequest.open("post","/roomsManager",false)
    xmlRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xmlRequest.send(encodedData)
    location.reload()
  })
});


document.querySelectorAll(".usersMember").forEach((user)=>{
  user.addEventListener("change", (e)=>{
    if(e.currentTarget.checked){
      user.setAttribute("name","usersMemberAdd")
    }
    else{
      user.setAttribute("name","usersMemberDel")
    }
  })
})

document.querySelectorAll("#name-room").forEach(inputName=>{
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



