const Message = require("../models/messagModel");

exports.formatMessage = async (username, text) => {
  const message = await Message.create({
    username,
    text,
  });

  return message;
};
