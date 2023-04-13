const sockets = io();
let user = "";
const txtemail = document.getElementById("txtemail");

Swal.fire({
  title: "Hola",
  input: "text",
  text: "Ingrese su email en el chat",
  inputValidator: (value) => {
    return !value && "Necesitas un email.";
  },
  allowOutsideClick: false,
  icon: "success",
}).then((result) => {
  user = result.value;

  txtemail.value = user;
});

const txtmessage = document.getElementById("txtmessage");
const btnEnviar = document.getElementById("btnEnviar");

btnEnviar.addEventListener("click", (evt) => {
  let bodyMessage = {
    email: user, //txtemail.value,
    message: txtmessage.value,
  };

  let mensaje = "";

  if (bodyMessage.email == "" || bodyMessage.message == "") {
    mensaje = "";
    Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      title: "Debe ingresar los datos.",
      icon: "success",
    });
  }
  if (mensaje == "") {
    sockets.emit("messagechatrealtime", bodyMessage);

    txtmessage.value = "";
  }
});

sockets.on("ret_messagechatrealtime", (data) => {
  const listabody = document.getElementById("listmessages");

  listabody.innerHTML = "";

  let listItems = "";
  data.listmessages.forEach((item) => {
    listItems = listItems + ` ${item.email} : ${item.message} <br> `;
  });
  listabody.innerHTML = listItems;
});
