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
 function captureEnter (event){
  
  if (event.key === "Enter") {
    let imagename = ''
    if(upImage){
      imagename = new Date().getTime() + upImage.name
      const newNameFile = new File([upImage],imagename)
      const formData = new FormData()
      formData.append("userUpload",newNameFile)
      const request = new XMLHttpRequest();
      request.open("post", "/uploads/images")
      request.send(formData)
    }
    const message = event.target.value;
    
    const data = {
      room,
      message,
      username,
      upImage : imagename
    };
    upImage = null
    deleteImage()
    event.target.value = "";
    socket.emit("message", data);
  }
}

function createMessage(data) {
  console.log(data)
  const messagesDiv = document.getElementById("messages");
  let classMessage = 'new_message'
  if(data.username === username)
    classMessage = 'user_input'
  messagesDiv.innerHTML += `
      <div class="${classMessage}">
          <label class="form-label">
              <span>${data.username} - 
              ${dayjs(data.date).format("DD/MM/YYYY HH:mm")}
              </span>
              <div>
                ${data.message}
              </div>
              ${/*data.upImage !== undefined ? messagesDiv.innerHTML += `
              <div class="image-div">
                <img src="${data.upImage}" alt="userUp" name="upImage" class="upImage">
              </div>
              ` : ""  
              */''}
          </label>
      </div>
    `;
    scrollDown()
}

function scrollDown() {
  window.scrollTo(0, document.body.scrollHeight);
}

//capturando imagem selecionado pelo usuario
document.querySelector("#inp-upload-arq").addEventListener("input",()=>{
  insertImg()
})

function insertImg(){
  deleteImage()
  const image = document.querySelector("#inp-upload-arq").files
  upImage = image[0]
   if(upImage.length!==0){
    let inputUser = document.querySelector(".input-user")
    inputUser.innerHTML += `<div id="image-user">
    <span onclick="deleteImage()">&times;</span>
    <img src="${URL.createObjectURL(upImage)}" alt="userUp" name="upImage" class="upImage">
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

