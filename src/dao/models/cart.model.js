let mongoose = require("mongoose");
let mongoosePaginate = require("mongoose-paginate-v2");
const modelCollection = "cart";
const itemSchema = new mongoose.Schema({
  idproducto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "productos",
  },
  id: {
    type: Number,
    require: true,
    minLength: 1,
    index: true,
  },
  quantity: {
    type: Number,
    require: true,
    min: 1,
  },
});

const modelSchema = new mongoose.Schema({
  id: Number,
  products: [itemSchema],
});

/*
modelSchema.pre('find',function(){
  this.populate('products.idproducto');
})
*/
modelSchema.plugin(mongoosePaginate);
const cartModel = mongoose.model(modelCollection, modelSchema);

module.exports = cartModel;
