const mongoose = require("mongoose");
const dbPath = "mongodb://127.0.0.1:27017/XianXiaoYuMall";
mongoose.connect(dbPath);
mongoose.connection.on("open", async () => {
  console.log("数据库连接成功！");
});
mongoose.connection.on("error", () => {
  console.log("数据库连接失败");
});
