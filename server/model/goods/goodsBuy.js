const mongoose = require("mongoose");
const goodsBuySKU = mongoose.Schema({
  buyerContacterName: String,
  buyerPhoneNumber: String,
  buyerAddress: String,
  buyerUserId: String,
  sellerContacterName: String,
  sellerPhoneNumber: String,
  sellerAddress: String,
  sellerUserId: String,
  orderTime: String,
  goodsId: String,
  goodsName: String,
  buyTime: String,
  dealTime: String,
  goodsPrice: Number,
  status: String,
  currentStatus: Number,
});
module.exports = mongoose.model("goodsBuySKU", goodsBuySKU);
