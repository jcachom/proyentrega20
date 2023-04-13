let mongoose = require("mongoose");
let mongoosePaginate = require("mongoose-paginate-v2");
const modelCollection = "courses";
const modelSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  teacher: String,
});
modelSchema.plugin(mongoosePaginate);
const coursesModel = mongoose.model(modelCollection, modelSchema);

module.exports = coursesModel;
