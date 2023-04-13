let fs = require("fs");

let { estructMensaje, ___dirname } = require("../../utils");

class productManager {
  constructor() {
    this.path = ___dirname + "/dao/files/productos.json";
  }

  #estructProduct = {
    properties: {
      code: { type: "string", minlength: 1 },
      title: { type: "string", minlength: 1 },
      description: { type: "string", minlength: 1 },
      price: { type: "number" },
      status: { type: "boolean" },
      stock: { type: "number" },
      category: { type: "string", minlength: 1 },
      thumbnail: { type: "array", minlength: 1 },
    },
    required: ["code", "title", "description", "price", "thumbnail", "stock"],
  };

  #getNewId(productos) {
    let mayor = 0;
    productos.forEach((element) => {
      if (element.id > mayor) mayor = element.id;
    });
    return mayor + 1;
  }

  async addProduct(product) {
 
    let response ={
      status : "S", 
      message:"",
      payload:null
    }

    let productos = await this.getProducts();
    let findProduct = productos.filter((X) => X.code == product.code);

    response.status = "E";
    response.message = "Código se encuentra registrado";

    if (findProduct.length == 0) {
      let new_product_id = this.#getNewId(productos);
      let new_product = {
        id: new_product_id,
        ...product,
      };
      productos.push(new_product);

      let contenido = JSON.stringify(productos, null, 2);
      await fs.promises.writeFile(`${this.path}`, contenido);

      response.status = "S";
      response.message = "Producto adicionado/modificado.";
      response.payload = new_product;
 
    }

    return response;
  }

  async getProducts() {
    let productos = await fs.promises.readFile(`${this.path}`, "utf-8");

    return JSON.parse(productos);
  }

  async getProductById(id) {
    let productos = await this.getProducts();
    let findProduct = productos.find((X) => X.id == id);

    let response = new estructMensaje().response;
    response.status = "E";
    response.mensaje = "Not found";

    if (findProduct != undefined) {
      response.status = "S";
      response.mensaje = "Producto encontrado";
      response.payload = findProduct;
    }

    return response;
  }

  async updateProduct(product) {
 
    let result;
    let rpta = 0
    result= await this.deleteProduct(product.id);
    if (result == "0") return result;

    let new_product = {
      ...product,
    };
     result = await this.addProduct(new_product);
     rpta=1;
    return rpta;
  }

  async deleteProduct(id) {
 
  let result;
  let rpta = 0
    let productos = await this.getProducts();
    let find = false;
    for (const key in productos) {
      if (productos[key].id == id) {
        productos.splice(key, 1);
        find = true;
      }
    }

    if (find) {
      let contenido = JSON.stringify(productos, null, 2);
      await fs.promises.writeFile(`${this.path}`, contenido);
      rpta=1;
    }
    return rpta;
  }

  async deleteProductAll() {
    let rpta = 0
    await fs.promises.writeFile(`${this.path}`, "[]");
    rpta=1;
    return rpta;
  }
}

module.exports = productManager;
