const socket = io("http://localhost:3000");
const messageContainer = document.getElementById("message-container");
const messageForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");

const name = prompt("What is your name?");
appendMessage("You joined");
const data = {
  name: name,
  room: "room1",
};
socket.emit("new-user", data);

socket.on("chat-message", (data) => {
  console.log(data);
  if (data.room === "room1") {
    appendMessage(`${data.name}: ${data.message}`);
  }
});

socket.on("user-connected", (data) => {
  if (data.room === "room1") {
    console.log(data);
    appendMessage(`${data.name} connected`);
  }
});

socket.on("user-disconnected", (data) => {
  if (data.room === "room1") {
    appendMessage(`${data.name} disconnected`);
  }
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  appendMessage(`You: ${message}`);
  socket.emit("send-chat-message", { message: message, room: "room1" });
  messageInput.value = "";
});

function appendMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}
