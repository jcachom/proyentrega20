let usersModel = require("../models/user.model");

class usersManager {
  constructor() {}

  getAll = async () => {
    let result = await usersModel.find().lean();
    return result;
  };

  saveUser = async (user) => {
    let result = await usersModel.create(user);
    return result;
  };

  updateUser = async (id) => {
    let result = await usersModel.updateOne({ _id: id });
    return result;
  };
}

module.exports = usersManager;
