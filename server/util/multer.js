const multer = require("@koa/multer");
const path = require("path");
let dst = "../uploads";
let storageBlogimg = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, dst));
  },
  filename: (req, file, cb) => {
    let ext = file.originalname.substr(file.originalname.lastIndexOf("."));
    let filename = Date.now() + ext;
    cb(null, filename);
  },
});
exports.storageBlogimg = multer({ storage: storageBlogimg });
