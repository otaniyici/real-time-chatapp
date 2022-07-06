const User = require("../models/userModel");

exports.userJoin = async (username, room) => {
  let user = await User.findOne({ username });
  if (!user) {
    user = await User.create({
      username: username,
      room: room,
      active: true,
    });
  }

  return user;
};

exports.getRoomUsers = async (room) => {
  let users = await User.find({ room, active: true });
  return users;
};
