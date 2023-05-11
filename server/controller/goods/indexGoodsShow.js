const { query } = require("koa2/lib/request");
const goodsRelease = require("../../model/goods/goodsRelease");
class IndexGoodsShow {
  async indexGoodsShow(ctx) {
    let technoRelease = await query(0);
    let studyRelease = await query(1);
    let dressRelease = await query(2);
    function query(goodsType) {
      return goodsRelease
        .find(
          { goodsType, status: "已上架" },
          { _id: 1, releaseTime: 1, goodsName: 1, goodsImgList: 1 }
        )
        .limit(5)
        .sort({ releaseTime: -1 });
    }
    ctx.body = {
      code: 200,
      msg: "请求成功",
      data: {
        techno: technoRelease,
        study: studyRelease,
        dress: dressRelease,
      },
    };
  }
}
module.exports = new IndexGoodsShow();
