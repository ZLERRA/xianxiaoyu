const goodsRelease = require("../../model/goods/goodsRelease");
const userList = require("../../model/user/login");
class getOrderList {
  async getOrderList(ctx) {
    let {
      username,
      type,
      status,
      pageSize = 10,
      pageNum = 1,
    } = ctx.request.body;
    let findUsername = null;
    let query = {};
    if (username !== "") {
      findUsername = await userList.find({ username });
      findUsername.length === 0
        ? (query["userId"] = "闲小鱼闲置商城")
        : (query["userId"] = findUsername[0]._id);
    }
    if (type !== "") query["goodsType"] = type;
    if (status !== "") query["status"] = status;
    let data = await goodsRelease
      .find(query)
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize);
    let totalLength = await goodsRelease.find(query);
    let total = totalLength.length;
    let orderList = {};
    let result = [];
    for (let i = 0; i < data.length; i++) {
      let { username } = await userList.findOne({ _id: data[i].userId });
      result.push({
        id: data[i].id,
        username,
        goodsName: data[i].goodsName,
        goodsDesc: data[i].goodsDesc,
        goodsType: data[i].goodsType,
        goodsPrice: data[i].goodsPrice,
        tradingType: data[i].tradingType,
        goodsImgList: data[i].goodsImgList,
        releaseTime: data[i].releaseTime,
        status: data[i].status,
        soldOutReason: data[i].soldOutReason.replace("下架原因：", ""),
      });
    }
    ctx.body = {
      code: 200,
      msg: "请求成功",
      data: (orderList = { total, result }),
    };
  }
}
module.exports = new getOrderList();
