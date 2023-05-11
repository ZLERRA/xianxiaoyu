const goodsRelease = require("../../model/goods/goodsRelease");
const fileToBase64 = require("../../util/fileToBase64");
const main = require("../../util/ocr");
const userInfo = require("../../model/user/userInfo");
const { unlink } = require("fs");
const dst = "../../uploads";
const { join } = require("path");
class GoodsRelease {
  async goodsRelease(ctx) {
    let {
      userId,
      goodsName,
      goodsDesc,
      goodsPrice,
      goodsType,
      tradingType,
      type = "",
      goodsId = "",
    } = ctx.request.body;
    let wordDetectionArr = [
      "二货",
      "偷",
      "代写",
      "代课",
      "作弊",
      "枪",
      "替考",
      "代考",
      "打架",
      "逃课",
      "翻墙",
      "约架",
      "傻逼",
      "约",
      "打死",
      "半脑",
      "fuck",
      "bitch",
      "shit",
      "sb",
    ];
    let result = [];
    let getOcrResult = new Promise(async (resolve, reject) => {
      await ctx.request.files.forEach(async (item) => {
        const res = await main(fileToBase64(item.path));
        result.push({
          filename: item.filename,
          res: res == undefined ? { keyword: "未能识别" } : res[0],
        });
        if (result.length === ctx.request.files.length) resolve(result);
      });
    });
    getOcrResult.then(async (res) => {
      let getOcrResultKeyword = "";
      let badWordCount = 0;
      let imgFilename = [];
      res.forEach((item) => {
        getOcrResultKeyword += String(item.res.keyword);
        imgFilename.push("http://localhost:4000/" + item.filename);
      });
      wordDetectionArr.forEach((item) => {
        if (getOcrResultKeyword.includes(item)) badWordCount += 1;
      });
      if (type === "") {
        let { _id } = await goodsRelease.create({
          userId,
          goodsName,
          goodsDesc,
          goodsPrice,
          goodsType,
          tradingType,
          releaseTime: Date.now(),
          goodsImgList: imgFilename,
          status: badWordCount > 0 ? "已下架" : "已上架",
          currentStatus: 1,
          soldOutReason: badWordCount > 0 ? "图片未自动通过审核，已下架" : "",
        });
        let newUserInfoResult = [];
        let userInfoResult = await userInfo.findOne(
          { userId },
          { sellerOreder: 1 }
        );
        newUserInfoResult = userInfoResult.sellerOreder;
        newUserInfoResult.push(_id);
        await userInfo.findOneAndUpdate(
          { userId },
          { sellerOreder: newUserInfoResult }
        );
      } else {
        let { goodsImgList } = await goodsRelease.findOne({
          _id: goodsId,
        });
        goodsImgList.forEach((item) => {
          unlink(
            `${join(__dirname, dst)}/${item.replace(
              "http://localhost:4000/",
              ""
            )}`,
            (err) => {
              err ? console.log(err) : console.log("删除成功");
            }
          );
        });
        await goodsRelease.findOneAndUpdate(
          { _id: goodsId },
          {
            userId,
            goodsName,
            goodsDesc,
            goodsPrice,
            goodsType,
            tradingType,
            releaseTime: Date.now(),
            goodsImgList: imgFilename,
            status: badWordCount > 0 ? "已下架" : "已上架",
            currentStatus: 1,
            soldOutReason: badWordCount > 0 ? "图片未自动通过审核，已下架" : "",
          }
        );
      }
    });
    ctx.body = {
      code: 200,
      msg: "发布成功，审核通过后自动上架！",
    };
  }
}
module.exports = new GoodsRelease();
