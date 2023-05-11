const userList = require("../../model/user/login");
const userInfo = require("../../model/user/userInfo");
class Register {
  async register(ctx) {
    let { username, password, identifier = 0, status = 1 } = ctx.request.body;
    let data = await userList.findOne({ username: username });
    if (!data) {
      let result = await userList.create({
        username: username,
        password: password,
        identifier,
        status,
        releaseStatus: true,
        buyStatus: true,
      });
      await userInfo.create({
        userId: result._id,
        contacterName: "",
        phoneNumber: "",
        address: "",
        buyerOrder: [],
        sellerOreder: [],
        shoppingCat: [],
      });
      ctx.body = {
        code: 200,
        msg: "注册成功",
      };
    } else {
      ctx.body = {
        code: 204,
        msg: "用户已存在",
      };
    }
  }
}
module.exports = new Register();
