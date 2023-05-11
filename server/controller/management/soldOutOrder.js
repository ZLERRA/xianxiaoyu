const getRelease = require("../../model/goods/goodsRelease");
const toReport = require("../../model/goods/toReport");
class SoldOutOrder {
  async soldOutOrder(ctx) {
    let { id, reason, _id } = ctx.request.body;
    if (reason !== "") {
      await getRelease.findOneAndUpdate(
        {
          _id: id,
        },
        { status: "已下架", soldOutReason: `下架原因：${reason}` }
      );
      if (_id !== "")
        await toReport.findOneAndUpdate({ _id }, { status: "已处理" });
    } else {
      await getRelease.findOneAndUpdate(
        {
          _id: id,
        },
        { status: "已上架", soldOutReason: "" }
      );
    }
    ctx.body = {
      code: 200,
      msg: "修改成功",
    };
  }
}
module.exports = new SoldOutOrder();
