let { Router } = require("express");
const router = Router();

//let productManager = require("../dao/fileManagers/productManager")
let productManager = require("../dao/dbManagers/productdbManager");

let oProducto = new productManager();

let { estructMensaje } = require("../utils");

router.get("/:pid", async (req, res) => {
  let response = new estructMensaje().response;
  try {
    let idProd = req.params["pid"];

    response = await oProducto.getProductById(idProd);
  } catch (error) {
    response.status = "E";
    response.mensaje = error.message;
  }
  res.json(response);
});
//http://localhost:8080/products/7

router.get("/", async (req, res) => {
  let response = new estructMensaje().response;
  try {
    let paramQuery = {
      cantFilas: new Number(req.query.limit ?? 10),
      page: new Number(req.query.page ?? 1),
      query: req.query.query ?? "",
      queryvalue: req.query.queryvalue ?? "",
      sort: req.query.sort ?? "",
    };
    response = await oProducto.getProducts_paginate(paramQuery);
  } catch (error) {
    response.status = "E";
    response.mensaje = error.message;
  }
  res.json(response);
});
//http://localhost:8080/products/?limit=2

router.post("/", async (req, res) => {
  let response = new estructMensaje().response;
  try {
    let product = req.body;
    let result = await oProducto.addProduct(product);

    response.status = result.status;
    response.mensaje = result.message;
    response.payload = result.payload;
  } catch (error) {
    response.status = "E";
    response.mensaje = error.message;
  }

  res.json(response);
});

router.put("/:pid", async (req, res) => {
  let response = new estructMensaje().response;
  try {
    response.status = "E";
    response.mensaje = "Producto no actualizado";

    let product = req.body;
    let uid = req.params["pid"];
    let rpta = await oProducto.updateProduct(product, uid);
    if (rpta == 1) {
      response.status = "S";
      response.mensaje = "Producto actualizado";
    }
  } catch (error) {
    response.status = "E";
    response.mensaje = error.message;
  }
  res.json(response);
});

router.delete("/:pid", async (req, res) => {
  let response = new estructMensaje().response;
  try {
    response.status = "E";
    response.mensaje = "Producto no eliminado";

    let uid = req.params["pid"];
    let rpta = await oProducto.deleteProduct(uid);

    if (rpta == 1) {
      response.status = "S";
      response.mensaje = "Producto eliminado";
    }
  } catch (error) {
    response.status = "E";
    response.mensaje = error.message;
  }
  res.json(response);
});

module.exports = router;
