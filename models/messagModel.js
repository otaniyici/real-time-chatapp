const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter your username!"],
    },
    text: {
      type: String,
      required: [true, "Please provide a text!"],
    },
    time: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
  }
);

messageSchema.virtual("formattedTime").get(function () {
  const date = this.time;
  return date.getHours() + ":" + date.getMinutes();
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
