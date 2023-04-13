let { Router } = require("express");

let productManager = require("../dao/dbManagers/productdbManager");
let messageManager = require("../dao/dbManagers/messagesdbManager");
let cartManager = require("../dao/dbManagers/cartdbManager");

let oProducto = new productManager();
let omessageManager = new messageManager();
let oCart = new cartManager();

//let userManager = require("../dao/dbManagers/usersdbManager");
//let coursesManager = require("../dao/dbManagers/coursesdbManager");

//let productManager = require("../dao/fileManagers/productManager");
//let oProducto = new productManager("../dao/files/productos.json");

const router = Router();

/*
let ouserManager = new userManager();
let ocoursesManager = new coursesManager();
router.get("/", async (req, res, next) => {
  let users = await ouserManager.getAll();
  res.render("users", { users });
});
router.get("/course", async (req, res, next) => {
  let courses = await ocoursesManager.getAll();
  res.render("courses", { courses });
});
router.get("/indexjc", async (req, res, next) => {
  res.render("indexhandle", {});
});

*/

router.get("/messagechat", async (req, res, next) => {
  let list;
  list = await omessageManager.getAll();
  res.render("messagechat", { messages: list });
});

router.get("/", async (req, res, next) => {
  let list;
  list = await oProducto.getProducts();
  res.render("home", { productos: list });
});

router.get("/realtimeproducts", async (req, res, next) => {
  let productos = [];
  productos = await oProducto.getProducts();
  res.render("realTimeProducts", { productos: productos });
});

router.get("/products", async (req, res, next) => {
  let paramQuery = {
    cantFilas: new Number(req.query.limit ?? 10),
    page: new Number(req.query.page ?? 1),
    query: req.query.query ?? "",
    queryvalue: req.query.queryvalue ?? "",
    sort: req.query.sort ?? "",
  };
  let email = req.query.email ?? "";
  let rol = req.query.rol ?? "";

  const { payload, hasPrevPage, hasNextPage, nextPage, prevPage } =
    await oProducto.getProducts_paginate(paramQuery);

  res.render("products", {
    productos: payload,
    hasPrevPage,
    hasNextPage,
    nextPage,
    prevPage,
    email,
    rol,
  });
});

router.get("/carts/:cid", async (req, res, next) => {
  let cid = req.params["cid"];
  let { id, payload } = await oCart.getCartbyId(cid);
  let itemList = [];

  for (const item of payload.products) {
    let producto = {
      ...item.idproducto._doc,
      quantity: item.quantity,
    };

    itemList.push(producto);
  }

  res.render("cartproducts", { cart: cid, productos: itemList });
});

router.get("/register", async (req, res, next) => {
  res.render("register");
});

router.get("/login", async (req, res, next) => {
  res.render("login");
});

module.exports = router;
