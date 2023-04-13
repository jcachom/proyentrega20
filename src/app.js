const express = require("express");
const session = require("express-session");
const sessionFileStore = require("session-file-store");
const MongoStore = require("connect-mongo");

const mongoose = require("mongoose");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
let { ___dirname } = require("./utils");
const path = require("path");

const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");

const userRouter = require("./routes/users.router");
const courseRouter = require("./routes/courses.router");
const viewsRouter = require("./routes/views.router");

const cookiesRouter = require("./routes/cookies.router");
const sessionRouter = require("./routes/session.router");

const cookieParser = require("cookie-parser");
const sessionfilestore = sessionFileStore(session);

let productManager = require("./dao//dbManagers/productdbManager");
let oProducto = new productManager();

let messageManager = require("./dao//dbManagers/messagesdbManager");
let omessageManager = new messageManager();

const PUERTO = 8080;
const MONGO_ATLAS_URI =
  "mongodb+srv://root:V5862GR3lrcPXvmk@cluster0.lyn5t.mongodb.net/dbcoder2023?retryWrites=true&w=majority";

const app = express();

app.engine("handlebars", handlebars.engine({ defaultLayout: "index" }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views", "hbs"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(___dirname + "/public"));

let connection;
(async () => {
  try {
    connection = mongoose.connect(MONGO_ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("conexion establecida");
    console.log("------------------------------------");
  } catch (error) {
    console.log(error);
  }
})();

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.use("/api/users", userRouter);
app.use("/api/courses", courseRouter);

app.use("/", viewsRouter);

app.use(cookieParser("codesecretl"));

/*
app.use(session({
  secret:"misecret",
  resave:true,
  saveUninitialized:true
}))
*/

/* app.use(session({
  store : new sessionfilestore({path:"./sessions",ttl:100,retries:0}),
  secret:"misecret",
  resave:false,
  saveUninitialized:false
}))
*/

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: MONGO_ATLAS_URI,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 15,
    }),
    secret: "misecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/api/cookies", cookiesRouter);

app.use("/api/sessions", sessionRouter);

const httpServer = app.listen(8080, () => {
  console.log("listen on PORT 8080");
});

const socketServer = new Server(httpServer);

const logs = [];
const logsChatBox = [];
socketServer.on("connection", (socket) => {
  console.log("Nuevo Cliente conectado");

  socket.on("mensaje", (data) => {
    console.log(data);
  });

  socket.on("msgchatbox", (data) => {
    logsChatBox.push({ socketId: socket.id, message: data });
    socketServer.emit("logchatbox", { logsChatBox });
  });

  socket.on("realtimeproducts", (data) => {
    let sendpoduct = async () => {
      let result = await oProducto.addProduct(data);
      let listProduct = await oProducto.getProducts(0);
      socketServer.emit("ret_realtimeproducts", { listProduct });
    };
    try {
      sendpoduct();
    } catch (error) {}
  });

  socket.on("messagechatrealtime", (data) => {
    let sendmessage = async () => {
      let result = await omessageManager.saveMessage(data);
      let listmessages = await omessageManager.getAll();
      socketServer.emit("ret_messagechatrealtime", { listmessages });
    };
    try {
      sendmessage();
    } catch (error) {}
  });
});

/*
-----VISTAS--------
inicio login : http://localhost:8080/login
listado de productos : http://localhost:8080/
paginación productos: http://localhost:8080/products
productos de un cart : http://localhost:8080/carts/1
chat mensaje : http://localhost:8080/messagechat
-------------------------------


---APIS------------------------

GET : todos los productos> http://localhost:8080/api/products
GET : producto con paginación> http://localhost:8080/api/products/?limit=3&page=2&query=categoria&queryvalue=casaca&sort=asc
GET  : producto por id > http://localhost:8080/api/products/7
POST : Add product > http://localhost:8080/api/products
 {
    "code": "abc200",
    "title": "producto prueba",
     "categoria":"casaca",
    "description": "Este es un producto prueba",
    "price": 200,
    "status": true,
    "stock": 250,
    "thumbnail": [
      "url1",
      "url2"
    ]
  }
  PUT : Update a product > http://localhost:8080/api/products/7
  {
    "code": "abc104",
    "title": "produc modif jc-tab.oi-uirddd",
     "categoría" : "casaca",
    "description": "Este es un producto pruebas",
    "price": 200,
    "status": true,
    "stock": 250,
    "thumbnail": [
      "url1",
      "url2"
    ]
  }


  DELETE : Delete a product > http://localhost:8080/api/products/20
  POST : Create a Cart > hhttp://localhost:8080/api/carts
  PUT : insertar varios productos > http://localhost:8080/api/carts/2
  [
    {
        "id":"1",
        "quantity":3
    },
    {
    "id":"2",
    "quantity":4
    }
]

  GET : todos los Carts > http://localhost:8080/api/carts
  GET : Get a Cart >http://localhost:8080/api/carts/1
  PUT : Adicionar producto al cart : http://localhost:8080/api/carts/1/product/8
  {
    "quantity": 3
}
  GET : All products by Cart > http://localhost:8080/api/carts/5
  DELETE : Delete a product in a Cart > http://localhost:8080/api/carts/1/product/8
   DELETE : Delete a cart > http://localhost:8080/api/carts/2

   -------------------
*/
