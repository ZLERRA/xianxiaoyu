const mongoose = require("mongoose");
const resultObject = mongoose.Schema({
  role: String,
  reason: String,
  time: Number,
});
const anomalyGoods = mongoose.Schema({
  buyerUserId: String,
  sellerUserId: String,
  goodsId: String,
  goodsSKUId: String,
  result: [resultObject],
});
module.exports = mongoose.model("anomalyGoods", anomalyGoods);
