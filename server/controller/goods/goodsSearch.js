const goodsRelease = require("../../model/goods/goodsRelease");
class Search {
  async search(ctx) {
    let { searchText } = ctx.request.body;
    searchText == ""
      ? (ctx.body = [])
      : (ctx.body = await goodsRelease
          .find(
            {
              goodsName: new RegExp(searchText),
              status: "已上架",
            },
            { goodsName: 1, _id: 1, releaseTime: 1 }
          )
          .limit(5));
  }
  async searchPage(ctx) {
    let { searchText } = ctx.request.body;
    let type0 = ["闲置", "数码", "手机", "电脑", "闲置数码"];
    let type1 = ["学习", "资料", "书", "学习资料"];
    let type2 = ["箱包", "服饰", "服装", "鞋子", "衣服", "箱包服饰"];
    let goodsType = null;
    let goodsResult = [];
    let returnResult = [];
    if (type0.some((item) => searchText.includes(item))) {
      goodsType = 0;
      let data = await goodsRelease.find({ goodsType }, { _id: 1 });
      data.forEach((item) => goodsResult.push(String(item._id)));
    }
    if (type1.some((item) => searchText.includes(item))) {
      goodsType = 1;
      let data = await goodsRelease.find({ goodsType }, { _id: 1 });
      data.forEach((item) => goodsResult.push(String(item._id)));
    }
    if (type2.some((item) => searchText.includes(item))) {
      goodsType = 2;
      let data = await goodsRelease.find({ goodsType }, { _id: 1 });
      data.forEach((item) => goodsResult.push(String(item._id)));
    }
    let goodsNameData = await goodsRelease.find(
      {
        goodsName: new RegExp(searchText),
        status: "已上架",
      },
      { _id: 1 }
    );
    goodsNameData.forEach((item) => goodsResult.push(String(item._id)));
    let goodsDescDate = await goodsRelease.find(
      {
        goodsDesc: new RegExp(searchText),
        status: "已上架",
      },
      { _id: 1 }
    );
    goodsDescDate.forEach((item) => goodsResult.push(String(item._id)));
    let result = [...new Set(goodsResult)];
    if (result.length !== 0) {
      for (let i = 0; i < result.length; i++) {
        let data = await goodsRelease.findOne(
          { _id: result[i], status: "已上架" },
          { goodsName: 1, releaseTime: 1, _id: 1, goodsImgList: 1 }
        );
        returnResult.push(data);
      }
    }
    ctx.body = {
      code: 200,
      msg: "请求成功",
      data: returnResult,
    };
  }
}
module.exports = new Search();
