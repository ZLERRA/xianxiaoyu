const KOA = require("koa2");
const CORS = require("koa2-cors");
const router = require("./router/index");
const { koaBody } = require("koa-body");
const jwt = require("koa-jwt");
const static = require("koa-static");
const ws = require("ws");
const PORT = 4000;
const App = new KOA();
require("./util/dbConnect");
App.use(static(__dirname + "/uploads"));
App.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    if (error.status == "401") {
      return (ctx.body = {
        code: "401",
        msg: "鉴权失败",
      });
    }
  }
});
App.use(CORS());
App.use(
  jwt({ secret: "safety" }).unless({
    path: [
      "/api/login",
      "/api/register",
      "/api/search",
      "/api/getOrderDetail",
      "/api/indexGoodsShow",
      "/api/getOrderDetail",
      "/api/searchPage",
    ],
  })
);
App.use(koaBody());
App.use(router.routes());
//koa与webSocket共享端口 4000
let server = App.listen(PORT, () => {
  console.log(`The server is running in http://localhost:${PORT}`);
});
const wss = new ws.Server({ server });
wss.on("connection", function connection(ws) {
  console.log("有人来了");
  ws.on("message", function incoming(message) {
    console.log("%s", message);
    // let data = JSON.parse(message);
    // console.log(data);
    // const decoded = jwt.verify(token.replace('Bearer ', ''), secret);
    //   ctx.state.user = decoded;
  });
});
