let cartModel = require("../models/cart.model");

let { estructMensaje } = require("../../utils");
let productManager = require("./productdbManager");

let oProducto = new productManager();

class cartManager {
  constructor() {}

  async createCart() {
    let response = new estructMensaje().response;

    let new_cart = null;

    let new_cart_id = 1;
    let cart_find = await cartModel.find().sort({ id: -1 }).limit(1);
    if (cart_find.length > 0) new_cart_id = new Number(cart_find[0].id) + 1;

    new_cart = {
      id: new_cart_id,
      products: [],
    };

    let result = await cartModel.create(new_cart);

    response.status = "S";
    response.mensaje = "Cart creado";
    response.payload = { cart_id: new_cart_id };

    return response;
  }

  async addProductCartMasivo(idCart, listProduct) {
    let responses = [];
    for (const item of listProduct) {
      let response = await this.addProductCart(idCart, item.id, item.quantity);
      responses.push(response);
    }
    return responses;
  }

  async addProductCart(idCart, idProduct, quantity) {
    idProduct = new Number(idProduct);
    let response = new estructMensaje().response;

    let oCarrito = await cartModel.findOne({ id: { $eq: idCart } });

    if (oCarrito == null) {
      response.status = "E";
      response.mensaje = "Cart no encontrado";
      return response;
    }

    let responseProduct = await oProducto.getProductById(idProduct);

    if (responseProduct.length == 0) {
      response.status = "E";
      response.mensaje = "Producto no existe";
      return response;
    }

    let ofindProducto = oCarrito.products.find((item) => item.id == idProduct);

    if (ofindProducto) {
      ofindProducto.quantity = ofindProducto.quantity + new Number(quantity);
      let result = await oCarrito.save();
    } else {
      let producto = {
        idproducto: responseProduct[0]._id,
        id: idProduct,
        quantity: new Number(quantity),
      };

      oCarrito.products.push(producto);
      let result = await oCarrito.save();
    }

    response.status = "S";
    response.mensaje = "producto adicionado/actualizado.";

    return response;
  }

  async getAllCart(condetalleProduct = false) {
    let list_cart;

    if (condetalleProduct) {
      list_cart = await cartModel.find().populate("products.idproducto");
    } else {
      list_cart = await cartModel.find();
    }

    return list_cart;
  }

  async getCartbyId(idCart) {
    let response = new estructMensaje().response;

    let oCarrito = await cartModel
      .findOne({ id: { $eq: idCart } })
      .populate("products.idproducto");

    if (oCarrito == null) {
      response.status = "E";
      response.mensaje = "Cart no encontrado";
      response.payload = null;
      return response;
    }

    response.status = "S";
    response.mensaje = "Cart encontrado";
    response.payload = oCarrito;

    return response;
  }

  async deleteCartbyId(idCart) {
    let response = new estructMensaje().response;
    let result = await cartModel.deleteOne({ id: { $eq: idCart } });

    response.status = "E";
    response.mensaje = "Cart no eliminado";

    if (result.deletedCount > 0) {
      response.status = "S";
      response.mensaje = "Cart eliminado";
    }

    return response;
  }

  async deleteProductFromCart(idCart, idProducto) {
    idProducto = new Number(idProducto);
    let response = new estructMensaje().response;

    let oCarrito = await cartModel.findOne({ id: { $eq: idCart } });

    if (oCarrito == null) {
      response.status = "E";
      response.mensaje = "Cart no encontrado";
      return response;
    }

    const index = oCarrito.products.findIndex((item) => item.id == idProducto);

    if (index == -1) {
      response.status = "E";
      response.mensaje = "producto no encontrado";
      return response;
    }
    oCarrito.products.splice(index, 1);

    let result = await oCarrito.save();

    response.status = "S";
    response.mensaje = "producto retirado.";

    return response;
  }
}

module.exports = cartManager;
