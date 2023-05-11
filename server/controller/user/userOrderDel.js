const userInfo = require("../../model/user/userInfo");
const goodsRelease = require("../../model/goods/goodsRelease");
class UserOrderDel {
  async userOrderDel(ctx) {
    let { id, type } = ctx.request.body;
    let userId = ctx.state.user.id;
    let result = [];
    let userInfoResult = await userInfo.findOne({ userId });
    if (type === "buy") {
      result = userInfoResult.buyerOrder;
      result = result.filter((item) => item != id);
      await userInfo.findOneAndUpdate({ userId }, { buyerOrder: result });
    } else {
      result = userInfoResult.sellerOreder;
      result = result.filter((item) => item != id);
      await goodsRelease.findOneAndUpdate({ _id: id }, { status: "已下架" });
      await userInfo.findOneAndUpdate({ userId }, { sellerOreder: result });
    }
    ctx.body = {
      code: 200,
      msg: "请求成功",
    };
  }
}
module.exports = new UserOrderDel();
