const socket = io();

let uploadArq = null;

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
    messages.forEach((message) => {
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
function captureEnter(event) {
  if (event.key === "Enter") {
    if (uploadArq) {
      let filename = new Date().getTime() + uploadArq.name
      const newNameFile = new File([uploadArq], filename)
      const formData = new FormData()
      formData.append("userUpload", newNameFile)
      const request = new XMLHttpRequest();
      request.open("post", "/uploads", true)
      request.upload.onprogress = (e) => {
        const progressbar = document.querySelector(".uploadArq-status")
        progressbar.style.display = "block"
        if (e.lengthComputable) {
          let percentage = (e.loaded / e.total) * 100;
          progressbar.innerText = percentage + "%"
        }
      }
      request.onerror = function (e) {
        deleteDivUpload()
      };
      request.upload.onload = function () {
        const messages = event.target.value;
        const data = {
          room,
          messages,
          username,
          nameFile: filename,
          nomeFuncionario,
          setor,
          cargo
        };
        event.target.value = "";
        socket.emit("message", data);
        deleteDivUpload()
      };
      request.send(formData)
    }
    else {
      const messages = event.target.value;
      const data = {
        room,
        messages,
        username,
        fileName: null,
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
  if (data.username === username)
    classMessage = 'user_input'

  if (data.nameFile !== "undefined" && data.nameFile !== undefined) {
    const urlImg = retornImgTypeFiles(data.nameFile.split(".").pop().toLowerCase()) || data.url_file
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
                  <img src="${urlImg}" 
                  onerror="this.onerror=null; this.src='${"/uploads/" + data.nameFile}'"
                   alt="image from ${data.username}"
                    name="userUp" class= "uploadArq">
                </div>
            </label>
        </div>
      `
  }
  else {
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
document.querySelector("#inp-upload-img").addEventListener("input", () => {
  insertImg()
})

function checkTipeImage(fileName) {
  const typeFile = fileName.split('.').pop();
  if (typeFile !== "png" && typeFile !== "jpg")
    return false
  return true
}
function insertImg() {
  deleteDivUpload()
  const image = document.querySelector("#inp-upload-img").files
  uploadArq = image[0]
  if (uploadArq.length !== 0) {
    if (checkTipeImage(uploadArq.name) == false) {
      alert("Tipo de arquivo invalido!!")
      return;
    }
    let inputUser = document.querySelector(".input-user")
    inputUser.innerHTML += `<div id="image-user">
    <span onclick="deleteDivUpload()">&times;</span>
    <img src="${URL.createObjectURL(uploadArq)}" alt="userUp" name= "uploadArq" class= "uploadArq">
    <div class="uploadArq-status">
      <div></div>
    </div>
  </div>`
    document
      .getElementById("message_input")
      .addEventListener("keypress", (event) => captureEnter(event));
  }
  document.querySelector("#inp-upload-img").addEventListener("change", () => insertImg())
}

function deleteDivUpload() {
  let divImg = document.querySelector("#image-user")
  if (divImg)
    divImg.parentNode.removeChild(divImg)
}


function checkTipeFile(nameFile) {
  const typesFile = ["mp3", "txt", "docx", "pdf", "pptx"]
  const extension = nameFile.split('.').pop();
  if (typesFile.indexOf(extension) == -1)
    return false
  return retornImgTypeFiles(extension)
}
function retornImgTypeFiles(extension){
  const typesFile = ["mp3", "txt", "docx", "pdf", "pptx"]
  if (extension.toLowerCase() == typesFile[0])
    return "/icon-mp3.png"
  else if (extension == typesFile[1])
    return "/icon-txt.png"
  else if (extension == typesFile[2])
    return "/icon-docx.png"
  else if (extension == typesFile[3])
    return "/icon-pdf.png"
  else if (extension == typesFile[0])
    return "/icon-pptx.png"
  else
    return null
}

document.querySelector("#inp-upload-file").addEventListener("input", (e) => {
  insertFile()
})

function insertFile() {
  deleteDivUpload()
  const file = document.querySelector("#inp-upload-file").files
  if(file[0].name.length > 45){
    alert("Nome do arquivo muito longo!")
    return
  }
  uploadArq = file[0]
  if (uploadArq.length!== 0) {
    const extension = checkTipeFile(uploadArq.name.toLowerCase())
    if (extension == false) {
      alert("Tipo de arquivo invalido!!")
      return;
    }

    let inputUser = document.querySelector(".input-user")
    inputUser.innerHTML += `<div id="image-user">
    <span onclick="deleteDivUpload()">&times;</span>
    <img src="${extension}" alt="userUp" name= "uploadArq" class= "uploadArq">
    <div class= uploadArq-status">
      <div></div>
    </div>
  </div>`
    document
      .getElementById("message_input")
      .addEventListener("keypress", (event) => captureEnter(event));
  }
  document.querySelector("#inp-upload-file").addEventListener("change", () => insertFile())
}

