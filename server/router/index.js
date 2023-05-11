const Router = require("koa-router");
const store = require("../util/multer");
const router = new Router();
const login = require("../controller/user/login");
const register = require("../controller/user/register");
const search = require("../controller/goods/goodsSearch");
const goodsRelease = require("../controller/goods/goodsRelease");
const getOrderList = require("../controller/management/getOrderList");
const getOrderDetali = require("../controller/management/getOrderDetail");
const soldOutOrder = require("../controller/management/soldOutOrder");
const delOrder = require("../controller/management/delOrder");
const user = require("../controller/management/user");
const index = require("../controller/management/index");
const userInfo = require("../controller/user/userInfo");
const goodsBuy = require("../controller/goods/goodsBuy");
const findUserOrder = require("../controller/user/findUserOrder");
const queryUserDel = require("../controller/user/queryUserDel");
const userOrderDetails = require("../controller/user/userOrderDetails");
const goodsAnomaly = require("../controller/goods/goodsAnomaly");
const deliverGoodsAndReceiving = require("../controller/goods/deliverGoodsAndReceiving");
const userOrderDel = require("../controller/user/userOrderDel");
const userShoppingCat = require("../controller/user/userShoppingCat");
const indexGoodsShow = require("../controller/goods/indexGoodsShow");
const toReport = require("../controller/user/toReport");
const abnormalUser = require("../controller/management/abnormalUser");
const getUserDetails = require("../controller/management/getUserDetail");

router
  .get("/api/indexGoodsShow", indexGoodsShow.indexGoodsShow) //首页栏目
  .post("/api/login", login.userLogin) //登录
  .post("/api/register", register.register) //注册
  .post("/api/search", search.search) //搜索
  .post("/api/searchPage", search.searchPage) //搜索页面
  .post("/api/queryTheUserPermissions", login.queryTheUserPermissions) //查询用户权限
  .get("/api/queryUserStatus", login.queryUserStatus) //查询账号状态
  .post(
    "/api/release",
    store.storageBlogimg.array("blogimg"),
    goodsRelease.goodsRelease
  ) //发布商品
  .post("/api/getOrder", getOrderList.getOrderList) //获取商品列表
  .post("/api/getOrderDetail", getOrderDetali.getOrderDetali) //获取商品详情
  .post("/api/getOrderSalesRecord", getOrderDetali.getOrderSalesRecord) //获取商品销售记录
  .post("/api/soldOut", soldOutOrder.soldOutOrder) //下架商品
  .get("/api/delOrder/:id", delOrder.delOrder) //删除商品
  .get("/api/getIndex", index.index) //后台首页
  .post("/api/getUserList", user.getUserList) //获取用户列表
  .post("/api/controlUserStatus", user.controlUserStatus) //冻结、解冻用户账户
  .post("/api/getUserDetails", getUserDetails.getUserDetails) //获取用户账号详情
  .post("/api/editPassword", user.editPassword) //管理员修改用户密码
  .post("/api/editUserIdentifier", user.editUserIdentifier) //修改用户角色
  .post("/api/delUser", user.delUser) //删除用户
  .post("/api/getAbnormalUserList", abnormalUser.getAbnormalUserList) //获取异常用户列表
  .post("/api/abnormalUserFinish", abnormalUser.abnormalUserFinish) //处理完成异常用户
  .post("/api/userInfo", userInfo.creatUserInfo) //获取用户收货地址等信息
  .post("/api/userEditPassword", userInfo.userEditPassword) //用户修改密码
  .post("/api/findGoodsStatus", goodsBuy.findGoodsStatus) //获取此商品状态与用户个人信息完整性
  .post("/api/addShoppingCat", goodsBuy.addShoppingCat) //加入购物车
  .post("/api/delUserShopping", userShoppingCat.delUserShopping) //删除购物车商品
  .get("/api/queryUserShopping", userShoppingCat.queryUserShoppingCat) //查询用户购物车
  .get("/api/singleGetUserInfo/:id", userInfo.singleGetUserInfo) //单纯获取用户收货地址等信息;
  .post("/api/createTheOrder", goodsBuy.createTheOrder) //立即下单与付款
  .post("/api/cancelTheOrder", goodsBuy.cancelTheOrder) //取消下单
  .post("/api/findUserOrder", findUserOrder.findUserOrder) //查询用户相关订单
  .post("/api/personalHomePage", findUserOrder.personalHomePage) //个人中心
  .post("/api/toReport", toReport.toReport) //举报用户/商品
  .post("/api/queryUserDelOrder", queryUserDel.queryUserDel) //查询用户是否有权限进行删除个人中心订单操作
  .post("/api/userOrderDel", userOrderDel.userOrderDel) //用户删除个人中心订单
  .post("/api/userOrderDetails", userOrderDetails.userOrderDetails) //查询用户个人中心商品订单详情
  .post("/api/userReleaseCancel", goodsAnomaly.userReleaseCancel) //用户为发布者时取消订单
  .post("/api/deliverGoods", deliverGoodsAndReceiving.deliverGoods) //用户发货
  .post("/api/checkReceiving", deliverGoodsAndReceiving.checkReceiving); //用户收货

module.exports = router;
