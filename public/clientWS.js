const socket = io();

const username = window.username

const room = window.room


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
          </label>
      </div>
    `;
  console.log(Date(data.date))
}

document.getElementById(
  "username"
).innerHTML = `Olá ${username} - Você está na sala: ${room}`;

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

document
  .getElementById("message_input")
  .addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      const message = event.target.value;

      const data = {
        room,
        message,
        username,
      };

      event.target.value = "";
      socket.emit("message", data);
    }
  });

socket.on("message", (data) => {
  createMessage(data);
});

document.getElementById("logout").addEventListener("click", () => {
  window.location.href = "/";
});