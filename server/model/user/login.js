const mongoose = require("mongoose");
const userList = mongoose.Schema({
  username: String,
  password: String,
  identifier: Number,
  status: Number,
  releaseStatus: Boolean,
  buyStatus: Boolean,
});
module.exports = mongoose.model("userList", userList);
