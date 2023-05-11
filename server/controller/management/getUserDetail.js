const userList = require("../../model/user/login");
const userInfo = require("../../model/user/userInfo");
const goodsRelease = require("../../model/goods/goodsRelease");
const goodsSKU = require("../../model/goods/goodsBuy");
class GetUserDetails {
  async getUserDetails(ctx) {
    let { id, type } = ctx.request.body;
    let releaseGoodsCount,
      onSaleGoodsCount,
      dealGoodsCount = null;
    let tableData = [];
    releaseGoodsCount = await goodsRelease.find({ userId: id }).count();
    onSaleGoodsCount = await goodsRelease
      .find({ userId: id, status: "已上架" })
      .count();
    dealGoodsCount = await goodsSKU
      .find({ sellerUserId: id, status: "交易完成" })
      .count();
    dealGoodsCount += await goodsSKU
      .find({ buyerUserId: id, status: "交易完成" })
      .count();
    let { contacterName, phoneNumber, address } = await userInfo.findOne({
      userId: id,
    });
    let { status, releaseStatus, buyStatus } = await userList.findOne({
      _id: id,
    });
    if (type === "releaseGoods") {
      tableData = await goodsRelease
        .find({ userId: id })
        .sort({ releaseTime: -1 });
      if (tableData.length === 0) tableData = [];
    } else if (type === "onSaleGoods") {
      tableData = await goodsRelease
        .find({ userId: id, status: "已上架" })
        .sort({ releaseTime: -1 });
      if (tableData.length === 0) tableData = [];
    } else if (type === "buyGoods") {
      tableData = await goodsSKU
        .find({ buyerUserId: id })
        .sort({ orderTime: -1 });
      if (tableData.length === 0) tableData = [];
    } else if (type === "dealGoods") {
      let buyerData = await goodsSKU
        .find({ buyerUserId: id, status: "交易完成" })
        .sort({ orderTime: -1 });
      let sellerData = await goodsSKU
        .find({ sellerUserId: id, status: "交易完成" })
        .sort({ orderTime: -1 });
      if (buyerData !== 0) {
        buyerData.forEach((item) => tableData.push(item));
      }
      if (sellerData !== 0) {
        sellerData.forEach((item) => tableData.push(item));
      }
    }
    ctx.body = {
      code: 200,
      msg: "请求成功",
      data: {
        releaseGoodsCount,
        onSaleGoodsCount,
        dealGoodsCount,
        contacterName,
        phoneNumber,
        address,
        radioValue: {
          allFunctionValue: status === 1 ? true : false,
          releaseFunctionValue: releaseStatus,
          buyFunctionValue: buyStatus,
        },
        tableData,
      },
    };
  }
}
module.exports = new GetUserDetails();
