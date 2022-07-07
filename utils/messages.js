const moment = require("moment");

function formatMessage(username, text) {
  return {
    username,
    text,
    time: Date.now(),
  };
}

module.exports = formatMessage;
