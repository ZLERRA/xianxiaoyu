const toReport = require("../../model/goods/toReport");
const userList = require("../../model/user/login");
const goodsRelease = require("../../model/goods/goodsRelease");
class AbnormalUser {
  async getAbnormalUserList(ctx) {
    let { whistleUsername, reportedUsername, pageSize, pageNum, type } =
      ctx.request.body;
    let query = { type };
    let resultData = [];
    let total = 0;
    let data = [];
    if (whistleUsername !== "") {
      let data = await userList.findOne(
        { username: whistleUsername },
        { _id: 1 }
      );
      data.length !== 0
        ? (query["whistleUserId"] = data._id)
        : (query["whistleUserId"] = "闲小鱼闲置商城");
    }
    if (reportedUsername !== "") {
      let data = await userList.findOne(
        { username: reportedUsername },
        { _id: 1 }
      );
      data.length !== 0
        ? (query["reportedUserId"] = data._id)
        : (query["reportedUserId"] = "闲小鱼闲置商城");
    }
    data = await toReport
      .find(query)
      .sort({ reportedTime: 1 })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize);
    total = await toReport.find(query).count();
    resultData = JSON.parse(JSON.stringify(data));
    for (let i = 0; i < data.length; i++) {
      if (type === "user") {
        let whistleResult = await userList.findOne(
          { _id: data[i].whistleUserId },
          { username: 1, _id: 1 }
        );
        resultData[i].whistleUsername = whistleResult.username;
        let reportedResult = await userList.findOne(
          { _id: resultData[i].reportedUserId },
          { username: 1, _id: 1 }
        );
        resultData[i].reportedUsername = reportedResult.username;
      } else {
        let whistleResult = await userList.findOne(
          { _id: data[i].whistleUserId },
          { username: 1, _id: 1 }
        );
        resultData[i].whistleUsername = whistleResult.username;
        let reportedResult = await goodsRelease.findOne(
          { _id: resultData[i].reportedGoodsId },
          { goodsName: 1, _id: 1 }
        );
        resultData[i].reportedGoodsName = reportedResult.goodsName;
      }
    }
    data = resultData;
    ctx.body = {
      code: 200,
      msg: "请求成功",
      data: {
        data,
        total,
      },
    };
  }
  async abnormalUserFinish(ctx) {
    let { id } = ctx.request.body;
    await toReport.findOneAndDelete({ _id: id });
    ctx.body = {
      code: 200,
      msg: "删除成功",
    };
  }
}
module.exports = new AbnormalUser();
