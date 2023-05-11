const mongoose = require("mongoose");
const toReport = mongoose.Schema({
  whistleUserId: String,
  reportedUserId: String,
  reportedGoodsId: String,
  reportedTime: String,
  type: String,
  reason: String,
  status: String,
});
module.exports = mongoose.model("toReport", toReport);
