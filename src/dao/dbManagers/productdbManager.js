let productosModel = require("../models/productos.model");

class productManager {
  constructor() {}

  async addProduct(product) {
    let new_product_id = 1;
    let productos_find = await productosModel.find().sort({ id: -1 }).limit(1);
    if (productos_find.length > 0)
      new_product_id = new Number(productos_find[0].id) + 1;

    let new_product = {
      id: new_product_id,
      ...product,
    };
    let result = await productosModel.create(new_product);

    return {
      status: "S",
      message: "producto adicionado.",
      payload: new_product,
    };
  }

  //?limit=2&page=1&query=categoria&sort=asc&queryvalue=cereal

  async getProducts() {
    let productos = await productosModel.find({}).lean();
    //console.log("ini")
    //console.log(productos)
    //let list = productos.map((item) => item.toObject());

    return productos;
  }
  async getProducts_paginate(paramQuery) {
    let productos;

    let { cantFilas, page, query, queryvalue, sort } = paramQuery;

    let orden = {};

    if (sort == "asc") orden = { price: 1 };
    if (sort == "desc") orden = { price: -1 };

    let queryc = {};
    if (query != "" && queryvalue != "") {
      if (query == "categoria") queryc = { categoria: queryvalue };
      if (query == "disponibilidad") queryc = { status: queryvalue };
    }

    productos = await productosModel.paginate(queryc, {
      limit: cantFilas,
      page: page,
      lean: true,
      sort: orden,
    });

    return {
      status: "success",
      payload: productos.docs,
      totalPages: productos.totalPages,
      prevPage: productos.prevPage,
      nextPage: productos.nextPage,
      hasPrevPage: productos.hasPrevPage,
      hasNextPage: productos.hasNextPage,
      prevLink: productos.prevLink,
      nextLink: productos.nextLink,
    };
  }

  async getProductById(id) {
    let productos = await productosModel.find({ id: { $eq: id } });
    let list = productos.map((item) => item.toObject());

    return list;
  }

  async updateProduct(product, uid) {
    let rpta = 0;
    let result = await productosModel.updateOne({ id: uid }, product);
    if (result.matchedCount > 0 && result.modifiedCount > 0) rpta = 1;
    return rpta;
  }

  async deleteProduct(uid) {
    let rpta = 0;
    let result = await productosModel.deleteOne({ id: uid });
    console.log(result);
    if (result.deletedCount > 0) rpta = 1;
    return rpta;
  }
}

module.exports = productManager;
