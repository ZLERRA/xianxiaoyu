function getFileContentAsBase64(path) {
  const fs = require("fs");
  try {
    return fs.readFileSync(path, { encoding: "base64" });
  } catch (err) {
    throw new Error(err);
  }
}
module.exports = getFileContentAsBase64;
