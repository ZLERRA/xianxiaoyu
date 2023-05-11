const userList = require("../../model/user/login");
const jsonwebtoken = require("jsonwebtoken");
class Login {
  async userLogin(ctx) {
    let { username, password } = ctx.request.body;
    let data = await userList.findOne({ username: username });
    if (!data) {
      ctx.body = {
        code: 204,
        msg: "该账号未注册",
      };
    } else if (data.password !== password) {
      ctx.body = {
        code: 204,
        msg: "密码错误！",
      };
    } else {
      ctx.body = {
        code: 200,
        msg: "登录成功！",
        data: {
          id: data._id,
          username: data.username,
          loginTime: Date.now(),
          identifier: data.identifier,
          token: jsonwebtoken.sign({ id: data._id }, "safety", {
            expiresIn: "24h",
          }),
        },
      };
    }
  }
  async queryTheUserPermissions(ctx) {
    ctx.body = await userList.findOne(
      { _id: ctx.request.body.id },
      { identifier: 1, _id: 0 }
    );
  }
  async queryUserStatus(ctx) {
    let _id = ctx.state.user.id;
    let { status, releaseStatus, buyStatus } = await userList.findOne({ _id });
    ctx.body = {
      code: 200,
      msg: "请求成功",
      data: {
        status,
        releaseStatus,
        buyStatus,
      },
    };
  }
}
module.exports = new Login();
