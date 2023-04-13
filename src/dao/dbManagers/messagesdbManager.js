let messagesModel = require("../models/messages.model");

class messagesManager {
  constructor() {}

  getAll = async () => {
    let result = await messagesModel.find().lean();
    return result;
  };

  saveMessage = async (message) => {
    let result = await messagesModel.create(message);
    return result;
  };
}

module.exports = messagesManager;
