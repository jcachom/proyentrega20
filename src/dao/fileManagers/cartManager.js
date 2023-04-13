let fs = require("fs");
//let estructMensaje = require("../../utils");

let { estructMensaje, ___dirname } = require("../../utils");
let productManager = require("./productManager");

let oProducto = new productManager();

class cartManager {
  constructor() {
    this.url = ___dirname + "/dao/files/cart.json";
  }

  async createCart() {
    let response = new estructMensaje().response;

    let list_cart = await this.getAllCart(false);
    let new_cart = null;
    let new_cart_id = await this.getNewId(list_cart);
    new_cart = {
      id: new_cart_id,
      products: [],
    };
    list_cart.push(new_cart);
    let contenido = JSON.stringify(list_cart, null, 2);
    await fs.promises.writeFile(`${this.url}`, contenido);

    response.status = "S";
    response.mensaje = "Cart creado";
    response.payload = { cart_id: new_cart_id };

    return response;
  }

  async addProductCart(idCart, idProduct, quantity) {
    let response = new estructMensaje().response;

    let carritos = await fs.promises.readFile(`${this.url}`, "utf-8");
    let list_carritos = JSON.parse(carritos);
    let oCarrito = list_carritos.find((item) => item.id == idCart);

    if (oCarrito == undefined) {
      response.status = "E";
      response.mensaje = "Cart no encontrado";
      return response;
    }

    let responseProduct = await oProducto.getProductById(idProduct);
    if (responseProduct.status == "E") {
      response.status = "E";
      response.mensaje = responseProduct.mensaje;
      return response;
    }

    let ofindProducto = oCarrito.products.find((item) => item.id == idProduct);

    if (ofindProducto) {
      ofindProducto.quantity = ofindProducto.quantity + new Number(quantity);
    } else {
      let producto = {
        id: idProduct,
        quantity: quantity,
      };
      oCarrito.products.push(producto);
    }

    let contenido = JSON.stringify(list_carritos, null, 2);
    await fs.promises.writeFile(`${this.url}`, contenido);

    response.status = "S";
    response.mensaje = "producto adicionado/actualizado.";

    return response;
  }

  async getAllCart(condetalleProduct = false) {
    let carritos = await fs.promises.readFile(`${this.url}`, "utf-8");
    let list_cart = JSON.parse(carritos);
    if (condetalleProduct) {
      let listProducts = await oProducto.getProducts();
      list_cart.forEach((item) => {
        item.products = this.#MatchProductsCart(listProducts, item.products);
      });
    }
    return list_cart;
  }

  async getNewId(carritos) {
    let mayor = 0;
    carritos.forEach((element) => {
      if (element.id > mayor) {
        mayor = element.id;
      }
    });
    return mayor + 1;
  }

  #MatchProductsCart(listProducts, productsCart) {
    let listProduct = [];

    productsCart.forEach((item) => {
      let findProduct = null;
      if (listProducts.length > 0)
        findProduct = listProducts.find((x) => x.id == item.id);

      let result_producto = {
        idfind: item.id,
        quantity: item.quantity,
      };
      if (findProduct) {
        result_producto = {
          idfind: item.id,
          quantity: item.quantity,
          ...findProduct,
        };
      }
      listProduct.push(result_producto);
    });

    return listProduct;
  }

  async getCartbyId(idCart) {
    let response = new estructMensaje().response;

    let carritos = await fs.promises.readFile(`${this.url}`, "utf-8");
    let list_carritos = JSON.parse(carritos);
    let findCart = null;

    if (list_carritos.length == 0) {
      response.status = "E";
      response.mensaje = "Cart no encontrado";
      response.payload = null;
      return response;
    }
    findCart = list_carritos.find((item) => item.id == idCart);
    if (findCart == undefined) {
      response.status = "E";
      response.mensaje = "Cart no encontrado";
      response.payload = null;
      return response;
    }

    let listProducts = await oProducto.getProducts();

    let cartMatchProducts = this.#MatchProductsCart(
      listProducts,
      findCart.products
    );

    findCart.products = cartMatchProducts;

    response.status = "S";
    response.mensaje = "Cart encontrado";
    response.payload = findCart;

    return response;
  }

  async deleteCartbyId(idCart) {
    let carritos = await fs.promises.readFile(`${this.url}`, "utf-8");
    let list_carritos = JSON.parse(carritos);
    const index = list_carritos.findIndex((item) => item.id == idCart);

    let response = new estructMensaje().response;

    if (index !== -1) {
      list_carritos.splice(index, 1);
      let contenido = JSON.stringify(list_carritos, null, 2);
      await fs.promises.writeFile(`${this.url}`, contenido);

      response.status = "S";
      response.mensaje = "Cart eliminado";
    }

    return response;
  }

  async deleteProductFromCart(idCart, idProducto) {
    let response = new estructMensaje().response;
    let carritos = await fs.promises.readFile(`${this.url}`, "utf-8");
    let list_carritos = JSON.parse(carritos);
    let oCarrito = list_carritos.find((item) => item.id == idCart);

    if (oCarrito == undefined) {
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
    let contenido = JSON.stringify(list_carritos, null, 2);
    await fs.promises.writeFile(`${this.url}`, contenido);

    response.status = "S";
    response.mensaje = "producto eliminado";

    return response;
  }
}

module.exports = cartManager;
