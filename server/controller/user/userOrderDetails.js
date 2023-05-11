const goodsRelease = require("../../model/goods/goodsRelease");
const goodsBuySKU = require("../../model/goods/goodsBuy");
const userInfo = require("../../model/user/userInfo");
const getSteps = require("../../util/steps");
class UserOrderDetails {
  async userOrderDetails(ctx) {
    let { id, type, skuId } = ctx.request.body;
    let result = {
      SKUid: "",
      buyer: {
        contacterName: "",
        phoneNumber: "",
        address: "",
      },
      seller: {
        contacterName: "",
        phoneNumber: "",
        address: "",
      },
      goodsInfo: {
        goodsName: "",
        goodsImgList: "",
        goodsDesc: "",
        goodsPrice: "",
        releaseTime: "",
      },
      currentStatus: "",
      steps: "",
    };
    if (type === "release") {
      let goodsInfo = await goodsRelease.findOne({ _id: id });
      if (goodsInfo.status === "已下架" && goodsInfo.soldOutReason === "") {
        let data = await goodsBuySKU
          .findOne({ goodsId: id })
          .sort({ orderTime: -1 });
        result.SKUid = data._id;
        result.seller.address = data.sellerAddress;
        result.seller.contacterName = data.sellerContacterName;
        result.buyer.phoneNumber = data.buyerPhoneNumber;
        result.buyer.address = data.buyerAddress;
        result.buyer.contacterName = data.buyerContacterName;
        result.seller.phoneNumber = data.sellerPhoneNumber;
        result.goodsInfo.goodsName = goodsInfo.goodsName;
        result.goodsInfo.goodsImgList = goodsInfo.goodsImgList;
        result.goodsInfo.goodsDesc = goodsInfo.goodsDesc;
        result.goodsInfo.goodsPrice = goodsInfo.goodsPrice;
        result.goodsInfo.releaseTime = goodsInfo.releaseTime;
        result.steps = getSteps(data.currentStatus, data.status);
      } else if (
        goodsInfo.status === "已下架" &&
        goodsInfo.soldOutReason !== ""
      ) {
        let sellerUserInfo = await userInfo.findOne({
          userId: goodsInfo.userId,
        });
        result.seller.address = sellerUserInfo.address;
        result.seller.contacterName = sellerUserInfo.contacterName;
        result.seller.phoneNumber = sellerUserInfo.phoneNumber;
        result.goodsInfo.goodsName = goodsInfo.goodsName;
        result.goodsInfo.goodsImgList = goodsInfo.goodsImgList;
        result.goodsInfo.goodsDesc = goodsInfo.goodsDesc;
        result.goodsInfo.goodsPrice = goodsInfo.goodsPrice;
        result.goodsInfo.releaseTime = goodsInfo.releaseTime;
        result.steps = getSteps(1, goodsInfo.soldOutReason);
      } else {
        let sellerUserInfo = await userInfo.findOne({
          userId: goodsInfo.userId,
        });
        result.seller.address = sellerUserInfo.address;
        result.seller.contacterName = sellerUserInfo.contacterName;
        result.seller.phoneNumber = sellerUserInfo.phoneNumber;
        result.goodsInfo.goodsName = goodsInfo.goodsName;
        result.goodsInfo.goodsImgList = goodsInfo.goodsImgList;
        result.goodsInfo.goodsDesc = goodsInfo.goodsDesc;
        result.goodsInfo.goodsPrice = goodsInfo.goodsPrice;
        result.goodsInfo.releaseTime = goodsInfo.releaseTime;
        result.steps = getSteps(1, "已上架");
      }
    } else {
      let data = await goodsBuySKU.findOne({ _id: skuId });
      let goodsInfo = await goodsRelease.findOne({ _id: id });
      result.SKUid = data._id;
      result.seller.address = data.sellerAddress;
      result.seller.contacterName = data.sellerContacterName;
      result.buyer.phoneNumber = data.buyerPhoneNumber;
      result.buyer.address = data.buyerAddress;
      result.buyer.contacterName = data.buyerContacterName;
      result.seller.phoneNumber = data.sellerPhoneNumber;
      result.goodsInfo.goodsName = goodsInfo.goodsName;
      result.goodsInfo.goodsImgList = goodsInfo.goodsImgList;
      result.goodsInfo.goodsDesc = goodsInfo.goodsDesc;
      result.goodsInfo.goodsPrice = goodsInfo.goodsPrice;
      result.goodsInfo.releaseTime = goodsInfo.releaseTime;
      result.steps = getSteps(data.currentStatus, data.status);
    }
    ctx.body = {
      code: 200,
      msg: "请求成功",
      data: result,
    };
  }
}
module.exports = new UserOrderDetails();
