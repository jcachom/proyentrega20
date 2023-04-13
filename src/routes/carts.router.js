let { Router } = require("express");
const router = Router();

//let cartManager = require("../dao/fileManagers/cartManager");
let cartManager = require("../dao/dbManagers/cartdbManager");

let { estructMensaje } = require("../utils");
let oCart = new cartManager();

let response = new estructMensaje().response;

router.post("/", async (req, res) => {
  try {
    response = await oCart.createCart();
  } catch (error) {
    response.status = "E";
    response.mensaje = error.message;
  }

  res.json(response);
});

router.put("/:cid", async (req, res) => {
  try {
    let cid = req.params["cid"];
    let listProduct = req.body;
    response = await oCart.addProductCartMasivo(cid, listProduct);
  } catch (error) {
    response.status = "E";
    response.mensaje = error.message;
  }
  res.json(response);
});

router.put("/:cid/product/:pid", async (req, res) => {
  try {
    let cid = req.params["cid"];
    let pid = req.params["pid"];

    let { quantity } = req.body;
    //
    //let quantity = 1;
    response = await oCart.addProductCart(cid, pid, quantity);
  } catch (error) {
    response.status = "E";
    response.mensaje = error.message;
  }
  res.json(response);
});

router.get("/", async (req, res) => {
  try {
    response = await oCart.getAllCart(true);
  } catch (error) {
    response.status = "E";
    response.mensaje = error.message;
  }

  res.json(response);
});

router.get("/:cid", async (req, res) => {
  try {
    let cid = req.params["cid"];
    response = await oCart.getCartbyId(cid);
  } catch (error) {
    response.status = "E";
    response.mensaje = error.message;
  }

  res.json(response);
});

router.delete("/:cid", async (req, res) => {
  try {
    let cid = req.params["cid"];
    response = await oCart.deleteCartbyId(cid);
  } catch (error) {
    response.status = "E";
    response.mensaje = error.message;
  }
  res.json(response);
});

router.delete("/:cid/product/:pid", async (req, res) => {
  try {
    let cid = req.params["cid"];
    let pid = req.params["pid"];
    response = await oCart.deleteProductFromCart(cid, pid);
  } catch (error) {
    response.status = "E";
    response.mensaje = error.message;
  }

  res.json(response);
});

module.exports = router;
