const os = require("os");
const goodsRelease = require("../../model/goods/goodsRelease");
const goodsSKu = require("../../model/goods/goodsBuy");
const userList = require("../../model/user/login");
class Index {
  async index(ctx) {
    const totalMemory = os.totalmem() / (1024 * 1024); //总内存
    const freeMemory = os.freemem() / (1024 * 1024); //可用
    const usedMemory = totalMemory - freeMemory; //已用
    let dealCount = await goodsSKu.find({ status: "交易完成" }).count();
    let onSaleCount = await goodsRelease.find({ status: "已上架" }).count();
    let userCount = await userList.find({ identifier: 0 }).count();
    let digitalCount = await goodsRelease
      .find({ goodsType: 0, status: "已上架" })
      .count();
    let studyCount = await goodsRelease
      .find({ goodsType: 1, status: "已上架" })
      .count();
    let clothesCount = await goodsRelease
      .find({ goodsType: 2, status: "已上架" })
      .count();
    let releaseResult = await goodsRelease.find({ status: "已上架" });
    const today = new Date();
    const sevenDaysAgo = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      sevenDaysAgo.push(date);
    }
    const daily = [];
    const countArr = [];
    for (const day of sevenDaysAgo) {
      const start = day.setHours(0, 0, 0, 0);
      const end = day.setHours(23, 59, 59, 999);
      let count = 0;
      releaseResult.forEach((item) => {
        if (item.releaseTime >= start && item.releaseTime <= end) {
          count++;
        }
      });
      daily.push(
        day.toLocaleDateString().replace(/\//gi, "-").replace("2023-", "")
      );
      countArr.push(count);
    }
    ctx.body = {
      code: 200,
      msg: "请求成功",
      data: {
        typeCount: {
          digitalCount,
          studyCount,
          clothesCount,
        },
        core: {
          totalMemory: totalMemory.toFixed(2),
          usedMemory: usedMemory.toFixed(2),
          freeMemory: freeMemory.toFixed(2),
        },
        dealCount,
        onSaleCount,
        userCount,
        chart: {
          daily,
          countArr,
        },
      },
    };
  }
}
module.exports = new Index();
