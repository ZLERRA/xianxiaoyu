const goodsBuySKU = require("../../model/goods/goodsBuy");
class QueryUserDel {
  async queryUserDel(ctx) {
    let { id, type } = ctx.request.body;
    let query = {};
    if (type === "release") query["goodsId"] = id;
    if (type === "buy") query["_id"] = id;
    let data = await goodsBuySKU.findOne(query, { status: 1, _id: 0 });
    if (
      !data ||
      data.status === "卖家取消订单" ||
      data.status === "买家取消订单"
    ) {
      data = { status: "未被下单" };
    }
    ctx.body = {
      code: 200,
      msg: "请求成功",
      data,
    };
  }
}
module.exports = new QueryUserDel();
