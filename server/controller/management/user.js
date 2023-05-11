const userList = require("../../model/user/login");
class User {
  async getUserList(ctx) {
    let {
      username,
      identifier,
      status,
      pageSize = 10,
      pageNum = 1,
    } = ctx.request.body;
    let query = {};
    if (username !== "") query["username"] = username;
    if (identifier !== "") query["identifier"] = identifier;
    if (status !== "") query["status"] = status;
    let data = await userList
      .find(query)
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize);
    let totalLength = await userList.find(query);
    let total = totalLength.length;
    ctx.body = {
      code: 200,
      msg: "请求成功",
      data: { data, total },
    };
  }
  async controlUserStatus(ctx) {
    let { radioValue, id } = ctx.request.body;
    await userList.findOneAndUpdate(
      { _id: id },
      {
        status: radioValue.allFunctionValue,
        releaseStatus: radioValue.releaseFunctionValue,
        buyStatus: radioValue.buyFunctionValue,
      }
    );
    ctx.body = {
      code: 200,
      msg: "修改成功",
    };
  }
  async editPassword(ctx) {
    let { id, password } = ctx.request.body;
    await userList.findOneAndUpdate({ _id: id }, { password });
    ctx.body = {
      code: 200,
      msg: "修改成功",
    };
  }
  async editUserIdentifier(ctx) {
    let { identifier } = await userList.findOne({
      _id: ctx.request.body.id,
    });
    await userList.findOneAndUpdate(
      {
        _id: ctx.request.body.id,
      },
      { identifier: (identifier = identifier === 1 ? 0 : 1) }
    );
    ctx.body = {
      code: 200,
      msg: "修改成功",
    };
  }
  async delUser(ctx) {
    await userList.deleteOne({ _id: ctx.request.body.id });
    ctx.body = {
      code: 200,
      msg: "删除成功",
    };
  }
}
module.exports = new User();
