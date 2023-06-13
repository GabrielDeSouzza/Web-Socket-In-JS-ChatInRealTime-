const socket = io();

let uploadArq = null;

const userName = document.querySelector("#userName").textContent
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
    userName,
    room,
  },
  (messages) => {
    messages.forEach((message) => {
      createMessage(message);

    });
  }
);

//recebendo messagens do servidor
 socket.on("message",(data) => {
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
        deleteDivUploadFile()
      };
      request.upload.onload = function () {
        const messages = event.target.value;
        const data = {
          room,
          messages,
          userName,
          nameFile: filename,
          nomeFuncionario,
          setor,
          cargo
        };
        event.target.value = "";
        socket.emit("message", data);
        deleteDivUploadFile()
      };
      request.send(formData)
    }
    else {
      const messages = event.target.value;
      const data = {
        room,
        messages,
        userName,
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
  if (data.userName === userName)
    classMessage = 'user_input'
  const message = addLinkInMessage(data.messages)
  if (data.nameFile !== "undefined" && data.nameFile !== undefined) {
    let urlImg = retornImgTypeFiles(data.nameFile.split(".").pop().toLowerCase())
    if(urlImg === true)
      urlImg = data.url_file
    messagesDiv.innerHTML += `
        <div class="${classMessage}">
            <label class="form-label">
                <span>${data.userName}(${data.nomeFuncionario}) <br/>
                Cargo: ${data.cargo} - Setor: ${data.setor} <br/>
                ${dayjs(data.date).format("DD/MM/YYYY HH:mm")}
                </span>
                <p>
                  ${message}
                </p>
                <div class="image-div">
                  <img src="${urlImg}" 
                  onerror="this.src='${"/uploads/" + data.nameFile}'"
                   alt="image from ${data.userName}"
                    name="userUp" class= "uploadArq">
                    <a href="${verificarURLCloudinary(data.url_file,data.nameFile)===true?data.url_file:"/uploads/" + data.nameFile}" 
                     id="file-${data.nameFile}" target="_blank">Ver</a>
                </div>
            </label>
        </div>
      `
  }
  else {
    messagesDiv.innerHTML += `
        <div class="${classMessage}">
            <label class="form-label">
            <span>${data.userName}(${data.nomeFuncionario}) <br/>
            Cargo: ${data.cargo} - Setor: ${data.setor} <br/>
            ${dayjs(data.date).format("DD/MM/YYYY HH:mm")}
            </span>
              <p>
                ${message}
              <p>
          </label>
        </div>`
  }
  scrollDown()
}
function addLinkInMessage( message){
  console.log("foi")
  const links = extractLink(message)

  if(!links)
    return message
  let x = links.map((link) =>{
    const index = message.indexOf(link)
    if(index < 0){
      return message
    }
    message = message.substring(0,index)+ `<a target='_blank' href='${link}'>${link}</a>${message.split(link)[1]}`
    console.log(link)
    return message
  })
  return x[x.length-1]
}


function extractLink(message) {
  // Expressão regular para encontrar links
  const regex = /(https?:\/\/[^\s]+)/g;

  // Encontra todos os links na string
  const linksEncontrados = message.match(regex);

  if (linksEncontrados && linksEncontrados.length > 0) {
    // Extrai o primeiro link encontrado
    return linksEncontrados
  } else {
    false
  }
}


function scrollDown() {
  window.scrollTo(0, document.body.scrollHeight);
}

//capturando imagem selecionado pelo usuario
document.querySelector("#inp-upload-file").addEventListener("change", (e) => {
  insertFile()
})


function insertFile() {
  deleteDivUploadFile()
  uploadArq = document.querySelector("#inp-upload-file").files[0]
  if (uploadArq.length !== 0) {
    const checkResult = checkTipeFile(uploadArq.name)
    if (checkResult == false) {
      alert("Tipo de arquivo invalido!!")
      return;
    }
    else if (uploadArq.name.length > 45) {
      alert("Nome muito Grande")
      return
    }
    else if (uploadArq.size / 1000000 > 10) {
      alert("Arquivo muito grande, tamanho maximo de upload é de 10Mb")
      return
    }
    let inputUser = document.querySelector(".input-user")
    inputUser.innerHTML += 
    `<div id="file-user">
    <span onclick="deleteDivUploadFile()">&times;</span>
    <img src="${checkResult===true?URL.createObjectURL(uploadArq):checkResult}" alt="userUp" name= "uploadArq" class= "uploadArq">
    <span>${uploadArq.name}</span>
      <div></div>
    </div>
  </div>`
    document
      .getElementById("message_input")
      .addEventListener("keypress", (event) => captureEnter(event));
    document.querySelector("#inp-upload-file").addEventListener("change", () => insertFile())
  }

}

function checkTipeFile(nameFile) {
  const typesFile = ["mp3", "txt", "docx", "pdf", "pptx", "png", "jpg"]
  const extension = nameFile.split('.').pop();
  if (typesFile.indexOf(extension) == -1)
    return false
  return retornImgTypeFiles(extension)
}
function retornImgTypeFiles(extension) {
  const typesFile = ["mp3", "txt", "docx", "pdf", "pptx", "png", "jpg"]
  if (extension.toLowerCase() == typesFile[0])
    return "/icon-mp3.png"
  else if (extension == typesFile[1])
    return "/icon-txt.png"
  else if (extension == typesFile[2])
    return "/icon-docx.png"
  else if (extension == typesFile[3])
    return "/icon-pdf.png"
  else if (extension == typesFile[4])
    return "/icon-pptx.png"
  else if(extension == typesFile[5])
    return true
    else if(extension == typesFile[6])
    return true
  else
    return false
}
function deleteDivUploadFile() {
  let divImg = document.querySelector("#file-user")
  if (divImg) {
    divImg.parentNode.removeChild(divImg)
    document.querySelector("#inp-upload-file").removeEventListener("input", () => { })
  }
}


 function verificarURLCloudinary(url,fileName) {
fetch(url)
  .then(response => {

    if(response.status ==200){
      document.getElementById(`file-${fileName}`).href=url
      return true
    }
      
    else
      return false
    
  })
  .catch(error => {
    console.error('Erro:', error);
    return false
  });
}