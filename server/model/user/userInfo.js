const mongoose = require("mongoose");
const userInfo = mongoose.Schema({
  userId: String,
  contacterName: String,
  phoneNumber: String,
  address: String,
  buyerOrder: Array,
  sellerOreder: Array,
  shoppingCat: Array,
});
module.exports = mongoose.model("userInfo", userInfo);
