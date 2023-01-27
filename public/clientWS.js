const socket = io();

const username = window.username

const room = window.room


function createMessage(data) {
  const messagesDiv = document.getElementById("messages");

  messagesDiv.innerHTML += `
      <div class="new_message">
          <label class="form-label">
              <strong>${data.username}</strong> <span>${data.message} - ${dayjs(
                data.createdAt
              ).format("DD/MM HH:mm")}</span>
          </label>
      </div>
    `;
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
  console.log(data)
  createMessage(data);
});

document.getElementById("logout").addEventListener("click", () => {
  window.location.href = "/";
});