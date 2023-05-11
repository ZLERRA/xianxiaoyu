const userInfo = require("../../model/user/userInfo");
const userList = require("../../model/user/login");
class UserInfo {
  async creatUserInfo(ctx) {
    let { userId, type, contacterName, phoneNumber, address } =
      ctx.request.body;
    if (type === "edit") {
      let data = await userInfo.findOne({ userId });
      if (!data) {
        await userInfo.create({
          userId,
          contacterName,
          phoneNumber,
          address,
        });
      } else {
        await userInfo.findOneAndUpdate(
          { userId },
          { contacterName, phoneNumber, address }
        );
      }
      ctx.body = {
        code: 200,
        msg: "请求成功",
      };
    } else {
      let data = await userInfo.findOne({ userId });
      if (!data) {
        ctx.body = {
          code: 200,
          msg: "请求成功",
          data: [],
        };
      } else {
        ctx.body = {
          code: 200,
          msg: "请求成功",
          data,
        };
      }
    }
  }
  async userEditPassword(ctx) {
    let { id, data } = ctx.request.body;
    let { password } = await userList.findOne({ _id: id });
    if (data.oldPassword !== password) {
      ctx.body = {
        code: 204,
        msg: "新密码与旧密码不一致，请重新提交",
      };
    } else {
      await userList.findOneAndUpdate(
        { _id: id },
        { password: data.newPassword }
      );
      ctx.body = {
        code: 200,
        msg: "密码修改成功",
      };
    }
  }
  async singleGetUserInfo(ctx) {
    let userId = ctx.request.params.id;
    let data = await userInfo.findOne(
      { userId },
      { contacterName: 1, phoneNumber: 1, address: 1, _id: 0 }
    );
    ctx.body = {
      code: 200,
      msg: "请求成功",
      data,
    };
  }
}
module.exports = new UserInfo();
