const socket = io();

const username = window.username

const room = window.room

let upImage= null;

document.getElementById("logout").addEventListener("click", () => {
  window.location.href = "/";
});

document.getElementById(
  "username"
).innerHTML = `Olá ${username} - Você está na sala: ${room}`;

document
  .getElementById("message_input")
  .addEventListener("keypress", (event) => captureEnter(event));

//enviando dados e mensagens para o servidor
socket.emit(
  "userData",
  {
    username,
    room,
  },
(messages) => {
     messages.forEach(( message) => {
      createMessage(message);
      
    });
  }
);

//recebendo messagens do servidor
socket.on("message", (data) => {
  createMessage(data);
});


 //funciton criada para resolver bug do evento keypress quando seleciona uma img
 //o evento não funcionava mais
function captureEnter ( event){
  if(event.key === "Enter") {
    if(upImage!= undefined || upImage!= null){
      let imagename = new Date().getTime() + upImage.name.split('.')[0].replace(/[^a-z0-9]/gi,"")
      
      const newNameFile = new File([upImage],imagename)
      const formData = new FormData()
      formData.append("userUpload",newNameFile)
      const request = new XMLHttpRequest();
      request.open("post", "/uploads/images",true)
      request.upload.onprogress = (e)=>{
        const progressbar = document.querySelector(".upImage-status")
        progressbar.style.display= "block"
        if (e.lengthComputable) {
          let percentage = (e.loaded / e.total) * 100;
          progressbar.innerText = percentage+"%"
        }
      }
      request.onerror = function(e) {
        console.log('Error');
        console.log(e);
        deleteImage()
      };
      request.upload.onload = function() {
        const message = event.target.value;
        const data = {
          room,
          message,
          username,
          upImage : imagename
        };
        event.target.value = "";
        socket.emit("message", data);
        deleteImage()
      };
      request.send(formData)
    }
    else{
      const message = event.target.value;
      const data = {
        room,
        message,
        username,
        upImage : null
      };


      event.target.value = "";
      socket.emit("message", data);
    }
    upImage = null
  }
}

function createMessage(data) {
  const messagesDiv = document.getElementById("messages");
  let classMessage = 'new_message'
  if(data.username === username)
    classMessage = 'user_input'

    if(data.nameUpImage !== "undefined" && data.nameUpImage !== undefined){
    messagesDiv.innerHTML += `
        <div class="${classMessage}">
            <label class="form-label">
                <span>${data.username} - 
                ${dayjs(data.date).format("DD/MM/YYYY HH:mm")}
                </span>
                <div>
                  ${data.message}
                </div>
                <div class="image-div">
                  <img src="${data.upImage}" onerror="this.src='${window.location.href+"uploads/"+data.nameUpImage}'" alt="image from ${data.username}" name="userUp" class="upImage">
                </div>
                
            </label>
        </div>
      `
    }
    else{
      messagesDiv.innerHTML += `
        <div class="${classMessage}">
            <label class="form-label">
              <span>${data.username} - 
                ${dayjs(data.date).format("DD/MM/YYYY HH:mm")}
              </span>
              <div>
                ${data.message}
              </div> 
          </label>
        </div>`
    }
      scrollDown()
}

function scrollDown() {
  window.scrollTo(0, document.body.scrollHeight);
}

//capturando imagem selecionado pelo usuario
document.querySelector("#inp-upload-arq").addEventListener("input",()=>{
  insertImg()
})

function checkTypeFile(fileName){
  const typeFile = fileName.split('.').pop();
  if(typeFile!=="png" && typeFile!=="jpg")
    return false
  return true
}
function insertImg(){
  deleteImage()
  const image = document.querySelector("#inp-upload-arq").files
  upImage = image[0]
   if(upImage.length!==0){
    if(checkTypeFile(upImage.name)== false){
      alert("Tipo de arquivo invalido!!")
      return;
    }
    let inputUser = document.querySelector(".input-user")
    inputUser.innerHTML += `<div id="image-user">
    <span onclick="deleteImage()">&times;</span>
    <img src="${URL.createObjectURL(upImage)}" alt="userUp" name="upImage" class="upImage">
    <div class="upImage-status">
      <div></div>
    </div>
  </div>`
  document
  .getElementById("message_input")
  .addEventListener("keypress", (event) => captureEnter(event)); 
  }

  document.querySelector("#inp-upload-arq").addEventListener("change", () => insertImg())
}

function deleteImage(){
  let divImg =document.querySelector("#image-user")
  if(divImg)
    divImg.parentNode.removeChild(divImg)
}

