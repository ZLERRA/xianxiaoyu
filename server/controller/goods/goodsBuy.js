const goodsRelease = require("../../model/goods/goodsRelease");
const userInfo = require("../../model/user/userInfo");
const goodsBuySKU = require("../../model/goods/goodsBuy");

class GoodsBuy {
  constructor() {
    this.orderTimer = null;
    this.orderCreateTime = null;
  }
  async findGoodsStatus(ctx) {
    let { goodsId, userId } = ctx.request.body;
    let { status } = await goodsRelease.findOne({ _id: goodsId });
    let data = await userInfo.findOne(
      { userId },
      { contacterName: 1, phoneNumber: 1, address: 1, _id: 0 }
    );
    ctx.body = {
      code: 200,
      msg: "请求成功",
      data: {
        data,
        status,
      },
    };
  }
  async addShoppingCat(ctx) {
    let { goodsId } = ctx.request.body;
    let userId = ctx.state.user.id;
    let { status } = await goodsRelease.findOne(
      { _id: goodsId },
      { status: 1 }
    );
    if (status === "已上架") {
      let newResult = [];
      let { shoppingCat } = await userInfo.findOne(
        { userId },
        { shoppingCat: 1 }
      );
      if (shoppingCat.some((item) => item == goodsId)) {
        ctx.body = {
          code: 204,
          msg: "购物车已存在此件商品",
        };
      } else {
        newResult = shoppingCat;
        newResult.push(goodsId);
        await userInfo.findOneAndUpdate({ userId }, { shoppingCat: newResult });
        ctx.body = {
          code: 200,
          msg: "请求成功",
        };
      }
    } else {
      ctx.body = {
        code: 204,
        msg: "商品已下架",
      };
    }
  }
  createTheOrder = async (ctx) => {
    let SKUid = null;
    let {
      buyerContacterName,
      buyerPhoneNumber,
      buyerAddress,
      buyerUserId,
      sellerContacterName,
      sellerPhoneNumber,
      sellerAddress,
      sellerUserId,
      goodsId,
      goodsPrice,
      type,
      reSKUid,
      goodsName,
      createTime,
    } = ctx.request.body;
    if (type === "下单") {
      this.orderCreateTime = createTime;
      let { _id } = await goodsBuySKU.create({
        goodsName,
        buyerContacterName,
        buyerPhoneNumber,
        buyerAddress,
        buyerUserId,
        sellerContacterName,
        sellerPhoneNumber,
        sellerAddress,
        sellerUserId,
        goodsId,
        goodsPrice,
        orderTime: Date.now(),
        buyTime: "",
        dealTime: "",
        status: "已下单，等待买家付款",
        currentStatus: 2,
      });
      await goodsRelease.findOneAndUpdate(
        { _id: goodsId },
        { status: "已下架" }
      );
      let newUserInfoResult = [];
      let userInfoResult = await userInfo.findOne(
        { userId: buyerUserId },
        { buyerOrder: 1 }
      );
      newUserInfoResult = userInfoResult.buyerOrder;
      newUserInfoResult.push(_id);
      await userInfo.findOneAndUpdate(
        { userId: buyerUserId },
        { buyerOrder: newUserInfoResult }
      );
      SKUid = _id;
      this.orderTimer = setInterval(async () => {
        let { status } = await goodsBuySKU.findOne({ _id }, { status: 1 });
        if (status === "已付款，等待卖家发货") {
          clearInterval(this.orderTimer);
        } else if (Date.now() - this.orderCreateTime > 15 * 60 * 1000) {
          // 超过15分钟
          clearInterval(this.orderTimer);
          await goodsBuySKU.findOneAndUpdate(
            { _id },
            { status: "订单超时，已自动取消", currentStatus: 1 }
          );
          await goodsRelease.findOneAndUpdate(
            { _id: ctx.request.body.goodsId },
            { status: "已上架" }
          );
        }
      }, 1000);
      ctx.body = {
        code: 200,
        msg: "请求成功",
        data: {
          SKUid,
        },
      };
    } else {
      if (Date.now() - this.orderCreateTime > 15 * 60 * 1000) {
        clearInterval(this.orderTimer);
        await goodsBuySKU.findOneAndUpdate(
          { _id: reSKUid },
          { status: "订单超时，已自动取消", currentStatus: 1 }
        );
        await goodsRelease.findOneAndUpdate(
          { _id: goodsId },
          { status: "已上架" }
        );
        ctx.body = {
          code: 204,
          msg: "订单超时，已自动取消",
        };
      } else {
        await goodsBuySKU.findOneAndUpdate(
          { _id: reSKUid },
          { status: type, buyTime: Date.now(), currentStatus: 3 }
        );
        ctx.body = {
          code: 200,
          msg: "请求成功",
        };
      }
    }
  };
  cancelTheOrder = async (ctx) => {
    clearInterval(this.orderTimer);
    let { type, id, goodsId } = ctx.request.body;
    type = type === "buy" ? "买家" : "卖家";
    await goodsBuySKU.findOneAndUpdate(
      { _id: id },
      { status: `${type}取消订单` }
    );
    await goodsRelease.findOneAndUpdate({ _id: goodsId }, { status: "已上架" });
    ctx.body = {
      code: 200,
      msg: "订单取消成功",
    };
  };
}
module.exports = new GoodsBuy();
