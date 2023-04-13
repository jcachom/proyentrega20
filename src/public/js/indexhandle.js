console.log("iniciando javascrip cliente");
let user = "";
const sockets = io();
Swal.fire({
  title: "Hola",
  input: "text",
  text: "Ingrese su nombre en el chat",
  inputValidator: (value) => {
    return !value && "Necesitas un nombre de usuario";
  },
  allowOutsideClick: false,
  icon: "success",
}).then((result) => {
  user = result.value;
  sockets.emit("autenticado", user);
});

const inputchatbox = document.getElementById("chatbox");
const logchatbox = document.getElementById("logchatbox");

sockets.on("newuserconectado", (data) => {
  if (!user) return;
  Swal.fire({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    title: data + " se ha unido",
    icon: "success",
  });
});

inputchatbox.addEventListener("keyup", (evt) => {
  if (evt.key == "Enter") {
    if (inputchatbox.value.trim().length > 0) {
      sockets.emit("msgchatbox", inputchatbox.value);
      inputchatbox.value = "";
    }
  }
});

sockets.on("logchatbox", (data) => {
  let logs = "";
  data.logsChatBox.forEach((log) => {
    console.log(log);
    logs = logs + log.socketId + " dice:" + log.message + "<br/>";
  });
  logchatbox.innerHTML = logs;
});
