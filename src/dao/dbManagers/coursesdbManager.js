let coursesModel = require("../models/courses.model");

class coursesManager {
  constructor() {}

  getAll = async () => {
    let result = await coursesModel.find().lean();
    return result;
  };

  saveCourse = async (course) => {
    let result = await coursesModel.create(course);
    return result;
  };

  updateCourse = async (id) => {
    let result = await coursesModel.updateOne({ _id: id });
    return result;
  };
}

module.exports = coursesManager;
