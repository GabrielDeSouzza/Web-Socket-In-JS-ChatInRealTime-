const socket = io();

let uploadArq= null;

const username = document.querySelector("#username").textContent
const room = document.querySelector("#room").textContent
const nomeFuncionario = document.querySelector("#nomeFuncionario").textContent
const setor = document.querySelector("#setor").textContent
const cargo = document.querySelector("#cargo").textContent

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


 //function criada para resolver bug do evento keypress quando seleciona uma img
 //o evento não funcionava mais
function captureEnter ( event){
  if(event.key === "Enter") {
    if (uploadArq!= undefined || uploadArq!= null){
      let imagename = new Date().getTime() + uploadArq.name
      const newNameFile = new File( [uploadArq],imagename)
      const formData = new FormData()
      formData.append("userUpload",newNameFile)
      const request = new XMLHttpRequest();
      request.open("post", "/uploads/images",true)
      request.upload.onprogress = (e)=>{
        const progressbar = document.querySelector("uploadArq-status")
        progressbar.style.display= "block"
        if (e.lengthComputable) {
          let percentage = (e.loaded / e.total) * 100;
          progressbar.innerText = percentage+"%"
        }
      }
      request.onerror = function(e) {
        deleteImage()
      };
      request.upload.onload = function() {
        const messages = event.target.value;
        const data = {
          room,
          messages,
          username,
          nameUpImage : imagename,
          nomeFuncionario,
          setor,
          cargo
        };
        event.target.value = "";
        socket.emit("message", data);
        deleteImage()
      };
      request.send(formData)
    }
    else{
      const messages = event.target.value;
      const data = {
        room,
        messages,
        username,
        nameUpImage : null,
        nomeFuncionario,
        setor,
        cargo
      };


      event.target.value = "";
      socket.emit("message", data);
    }
   uploadArq = null
  }
}

function createMessage(data) {
  console.log(data)
  const messagesDiv = document.getElementById("messages");
  let classMessage = 'new_message'
  if(data.username === username)
    classMessage = 'user_input'

    if(data.nameUpImage !== "undefined" && data.nameUpImage !== undefined){
    messagesDiv.innerHTML += `
        <div class="${classMessage}">
            <label class="form-label">
                <span>${data.username}(${data.nomeFuncionario}) <br/>
                Cargo: ${data.cargo} - Setor: ${data.setor} <br/>
                ${dayjs(data.date).format("DD/MM/YYYY HH:mm")}
                </span>
                <p>
                  ${data.messages}
                </p>
                <div class="image-div">
                  <img src="${data.url_image}" 
                  onerror="this.src='${"/uploads/"+data.nameUpImage}'"
                   alt="image from ${data.username}"
                    name="userUp" class= "uploadArq">
                </div>
                
            </label>
        </div>
      `
    }
    else{
      messagesDiv.innerHTML += `
        <div class="${classMessage}">
            <label class="form-label">
            <span>${data.username}(${data.nomeFuncionario}) <br/>
            Cargo: ${data.cargo} - Setor: ${data.setor} <br/>
            ${dayjs(data.date).format("DD/MM/YYYY HH:mm")}
            </span>
              <p>
                ${data.messages}
              </p> 
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
 uploadArq = image[0]
   if (uploadArq.length!==0){
    if(checkTypeFile (uploadArq.name)== false){
      alert("Tipo de arquivo invalido!!")
      return;
    }
    let inputUser = document.querySelector(".input-user")
    inputUser.innerHTML += `<div id="image-user">
    <span onclick="deleteImage()">&times;</span>
    <img src="${URL.createObjectURL (uploadArq)}" alt="userUp" name= "uploadArq" class= "uploadArq">
    <div class= uploadArq-status">
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


