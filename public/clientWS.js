const socket = io();

const username = window.username

const room = window.room

const upInput = document.querySelector("#inp-upload-arq")
let upImage = [];

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
    const message = event.target.value;
    const data = {
      room,
      message,
      username
    };

    event.target.value = "";
    socket.emit("message", data);
  }
}

function createMessage(data) {
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
              ${data.upImage !== undefined ? messagesDiv.innerHTML += `
              <div class="image-div">
                <img src="${data.upImage}" alt="userUp" name="upImage" class="upImage">
              </div>
              ` : ""  
              }
          </label>
      </div>
    `;
}

//capturando imagem selecionado pelo usuario
upInput.addEventListener("change",()=>{
  const image = upInput.files
  upImage = image[0]
   if(upImage.length!==0){
    let inputUser = document.querySelector(".input-user")
    inputUser.innerHTML += `<div id="image-user">
    <img src="${window.URL.createObjectURL(upImage)}" alt="userUp" name="upImage" class="upImage">
  </div>`
  document
  .getElementById("message_input")
  .addEventListener("keypress", (event) => captureEnter(event)); 
  }
  upImage.value = ''
  upImage = []
})

