 
const sockets = io();

sockets.on("connect", () => {
  console.log("conectado en realtime");
});

sockets.on("msgproductos", (lisproductos) => {
  let list = "";
  const listdiv = document.getElementById("listp");
  lisproductos.forEach((item, indice) => {
    list =
      list +
      `
      <div  class="tarjeta">
              <br>
              id :${item.id}<br>
              code : ${item.code}   <br>
              description :  ${item.description}  <br>
              price : ${item.price}  <br>
              stock : ${item.stock}   <br>        
             </div>
              <br>     
     `;
  });

  listdiv.innerHTML = list;
});
