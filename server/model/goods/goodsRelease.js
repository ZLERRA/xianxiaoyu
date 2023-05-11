const mongoose = require("mongoose");
const goodsRelease = mongoose.Schema({
  userId: String,
  goodsName: String,
  goodsDesc: String,
  goodsType: String,
  goodsPrice: Number,
  tradingType: String,
  goodsImgList: Array,
  releaseTime: String,
  status: String,
  soldOutReason: String,
});
module.exports = mongoose.model("goodsRelease", goodsRelease);
