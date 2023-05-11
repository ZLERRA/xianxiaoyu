const userInfo = require("../../model/user/userInfo");
const goodsRelease = require("../../model/goods/goodsRelease");
class UserShoppingCat {
  async queryUserShoppingCat(ctx) {
    let userId = ctx.state.user.id;
    let result = [];
    let { shoppingCat } = await userInfo.findOne({ userId });
    if (shoppingCat.length !== 0) {
      for (let i = shoppingCat.length - 1; i > -1; i--) {
        let data = await goodsRelease.findOne({
          _id: shoppingCat[i],
        });
        result.push(data);
      }
    }
    ctx.body = {
      code: 200,
      msg: "请求成功",
      data: result,
    };
  }
  async delUserShopping(ctx) {
    let { goodsId } = ctx.request.body;
    let userId = ctx.state.user.id;
    let result = [];
    let { shoppingCat } = await userInfo.findOne({ userId });
    result = shoppingCat.filter((item) => item != goodsId);
    await userInfo.findOneAndUpdate({ userId }, { shoppingCat: result });
    ctx.body = {
      code: 200,
      msg: "请求成功",
    };
  }
}
module.exports = new UserShoppingCat();
