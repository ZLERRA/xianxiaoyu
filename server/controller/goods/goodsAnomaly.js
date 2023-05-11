const anomalyGoods = require("../../model/goods/anomalyGoods");
const goodsRelease = require("../../model/goods/goodsRelease");
const goodsBuySKU = require("../../model/goods/goodsBuy");
class GoodsAnomaly {
  async userReleaseCancel(ctx) {
    let { SKUid, goodsId, type, reason } = ctx.request.body;
    let process = [];
    let role = type === "buy" ? "买家" : "卖家";
    let data = await anomalyGoods.findOne({ goodsId });
    if (!data) {
      let goodsBuySKURes = await goodsBuySKU.findOne(
        { _id: SKUid },
        { buyerUserId: 1, sellerUserId: 1 }
      );
      process.push({
        role,
        reason,
        time: Date.now(),
      }),
        await anomalyGoods.create({
          buyerUserId: goodsBuySKURes.buyerUserId,
          sellerUserId: goodsBuySKURes.sellerUserId,
          goodsId: goodsId,
          goodsSKUId: SKUid,
          result: process,
        });
    } else {
      let data = await anomalyGoods.findOne({ goodsId }, { result: 1 });
      process = data.result;
      process.push({
        role,
        reason,
        time: Date.now(),
      }),
        await anomalyGoods.findOneAndUpdate(
          { goodsId },
          {
            result: process,
          }
        );
    }
    ctx.body = {
      code: 200,
      msg: "请求成功",
    };
  }
}
module.exports = new GoodsAnomaly();
