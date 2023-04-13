let mongoose = require("mongoose");
let mongoosePaginate = require("mongoose-paginate-v2");
const modelCollection = "messages";
const modelSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  message: {
    type: String,
    require: true,
  },
});
modelSchema.plugin(mongoosePaginate);
const messageModel = mongoose.model(modelCollection, modelSchema);

module.exports = messageModel;
