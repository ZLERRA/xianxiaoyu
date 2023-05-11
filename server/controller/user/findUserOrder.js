const goodsRelease = require("../../model/goods/goodsRelease");
const goodsBuy = require("../../model/goods/goodsBuy");
const userInfo = require("../../model/user/userInfo");
const userList = require("../../model/user/login");
class FindUserOrder {
  async findUserOrder(ctx) {
    let type = ctx.request.body.type;
    let userId = ctx.state.user.id;
    let data = [];
    let userInfoResult = await userInfo.findOne({ userId });
    if (type === "myRelease") {
      for (let i = userInfoResult.sellerOreder.length - 1; i > -1; i--) {
        let goodsReleaseResult = await goodsRelease.findOne(
          { _id: userInfoResult.sellerOreder[i] },
          { _id: 1, goodsPrice: 1, goodsName: 1 }
        );
        data.push(goodsReleaseResult);
      }
      let newArray = JSON.parse(JSON.stringify(data));
      newArray.forEach((item) => {
        item.type = "release";
        item.goodsId = item._id;
      });
      data = newArray;
    } else if (type === "myBuy") {
      for (let i = userInfoResult.buyerOrder.length - 1; i > -1; i--) {
        let goodsBuyResult = await goodsBuy
          .findOne(
            { _id: userInfoResult.buyerOrder[i] },
            { goodsId: 1, goodsPrice: 1, goodsName: 1 }
          )
          .sort({ orderTime: -1 });
        data.push(goodsBuyResult);
      }
      let newArray = JSON.parse(JSON.stringify(data));
      newArray.forEach((item) => (item.type = "buy"));
      data = newArray;
    } else if (type === "allList") {
      let newArray;
      let mix = [];
      let myRelease = [];
      let myBuy = [];
      for (let i = 0; i < userInfoResult.sellerOreder.length; i++) {
        let goodsReleaseResult = await goodsRelease
          .findOne(
            { _id: userInfoResult.sellerOreder[i] },
            { _id: 1, goodsPrice: 1, goodsName: 1, releaseTime: 1 }
          )
          .sort({ releaseTime: -1 });
        myRelease.push(goodsReleaseResult);
      }
      newArray = JSON.parse(JSON.stringify(myRelease));
      newArray.forEach((item) => {
        item.goodsId = item._id;
        item.type = "release";
        item.time = item.releaseTime;
        mix.push(item);
      });
      for (let i = 0; i < userInfoResult.buyerOrder.length; i++) {
        let goodsBuyResult = await goodsBuy
          .findOne(
            { _id: userInfoResult.buyerOrder[i] },
            { goodsId: 1, goodsPrice: 1, goodsName: 1, orderTime: 1, _id: 1 }
          )
          .sort({ orderTime: -1 });
        myBuy.push(goodsBuyResult);
      }
      newArray = JSON.parse(JSON.stringify(myBuy));
      newArray.forEach((item) => {
        item.type = "buy";
        item.time = item.orderTime;
        mix.push(item);
      });
      mix.sort((a, b) => {
        return b.time - a.time;
      });
      data = mix;
    } else {
      for (let i = userInfoResult.buyerOrder.length - 1; i > -1; i--) {
        let goodsBuyResult = await goodsBuy
          .findOne(
            {
              _id: userInfoResult.buyerOrder[i],
              status: "已发货，等待买家收货",
            },
            { goodsId: 1, goodsPrice: 1, goodsName: 1 }
          )
          .sort({ orderTime: -1 });
        if (goodsBuyResult) data.push(goodsBuyResult);
      }
    }
    ctx.body = {
      code: 200,
      msg: "请求成功",
      data,
    };
  }
  async personalHomePage(ctx) {
    let { userId } = ctx.request.body;
    let { username } = await userList.findOne({ _id: userId }, { username: 1 });
    let result = await goodsRelease.find({ userId, status: "已上架" });
    let dealCount = await goodsBuy
      .find({
        sellerUserId: userId,
        status: "交易完成",
      })
      .count();
    ctx.body = {
      code: 200,
      msg: "请求成功",
      data: {
        username,
        dealCount,
        result,
      },
    };
  }
}
module.exports = new FindUserOrder();
