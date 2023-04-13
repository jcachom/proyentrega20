let mongoose = require("mongoose");
let mongoosePaginate = require("mongoose-paginate-v2");
const modelCollection = "usuarios";
const modelSchema = new mongoose.Schema({
  first_name: {
    type: String,
    require: true,
  },
  last_name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  dni: Number,
  birthDate: Date,
  age: Number,
  gender: {
    type: String,
    enum: ["M", "F"],
  },
  password: {
    type: String,
    require: true,
  },
});
modelSchema.plugin(mongoosePaginate);
const userModel = mongoose.model(modelCollection, modelSchema);

module.exports = userModel;
