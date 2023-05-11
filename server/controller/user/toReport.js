const toReport = require("../../model/goods/toReport");
class ToReport {
  async toReport(ctx) {
    let { id, reason, type } = ctx.request.body;
    let whistleUserId = ctx.state.user.id;
    if (type === "user") {
      await toReport.create({
        reportedUserId: id,
        reportedGoodsId: "",
        reportedTime: Date.now(),
        whistleUserId,
        type,
        reason,
        status: "未处理",
      });
    } else {
      await toReport.create({
        reportedUserId: "",
        reportedGoodsId: id,
        reportedTime: Date.now(),
        whistleUserId: whistleUserId,
        type,
        reason,
        status: "未处理",
      });
    }
    ctx.body = {
      code: 200,
      msg: "请求成功",
    };
  }
}
module.exports = new ToReport();
