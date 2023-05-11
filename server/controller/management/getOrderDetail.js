const goodsRelease = require("../../model/goods/goodsRelease");
const userList = require("../../model/user/login");
const goodsBuySKU = require("../../model/goods/goodsBuy");
class getOrderDetali {
  async getOrderDetali(ctx) {
    let { id } = ctx.request.body;
    let data = await goodsRelease.findOne({ _id: id });
    let { username } = await userList.findOne({ _id: data.userId });
    ctx.body = {
      code: 200,
      msg: "请求成功",
      data: {
        data,
        username,
      },
    };
  }
  async getOrderSalesRecord(ctx) {
    let { id } = ctx.request.body;
    let data = await goodsBuySKU.find({ goodsId: id }).sort({ orderTime: -1 });
    ctx.body = {
      code: 200,
      msg: "请求成功",
      data,
    };
  }
}
module.exports = new getOrderDetali();
