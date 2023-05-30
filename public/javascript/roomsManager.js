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
});
