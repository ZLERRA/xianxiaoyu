const goodsBuySKU = require("../../model/goods/goodsBuy");
class DeliverGoodsAndReceiving {
  async deliverGoods(ctx) {
    let { id } = ctx.request.body;
    await goodsBuySKU.findOneAndUpdate(
      { _id: id },
      { status: "已发货，等待买家收货", currentStatus: 4 }
    );
    ctx.body = {
      code: 200,
      msg: "请求成功",
    };
  }
  async checkReceiving(ctx) {
    let { id } = ctx.request.body;
    await goodsBuySKU.findOneAndUpdate(
      { _id: id },
      { status: "交易完成", currentStatus: 5, dealTime: Date.now() }
    );
    ctx.body = {
      code: 200,
      msg: "请求成功",
    };
  }
}
module.exports = new DeliverGoodsAndReceiving();
