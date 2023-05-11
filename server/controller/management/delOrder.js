const goodsRelease = require("../../model/goods/goodsRelease");
const { unlink } = require("fs");
const dst = "../../uploads";
const { join } = require("path");
class DelOrder {
  async delOrder(ctx) {
    let { goodsImgList } = await goodsRelease.findOne({
      _id: ctx.request.params.id,
    });
    goodsImgList.forEach((item) => {
      unlink(
        `${join(__dirname, dst)}/${item.replace("http://localhost:4000/", "")}`,
        (err) => {
          err ? console.log(err) : console.log("删除成功");
        }
      );
    });
    await goodsRelease.deleteOne({ _id: ctx.request.params.id });
    ctx.body = {
      code: 200,
      msg: "删除成功",
    };
  }
}
module.exports = new DelOrder();
