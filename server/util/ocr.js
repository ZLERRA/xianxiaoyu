const request = require("request");
const AK = "7lUtZxgXPfTqkL2xLkXDdLaC";
const SK = "qGZs9C5TW949GZ7CkVKyXWIYSIjCX4V9";
async function main(imgToBase64, filename) {
  let result = filename;
  const options = {
    method: "POST",
    url:
      "https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general?access_token=" +
      (await getAccessToken()),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    form: {
      image: imgToBase64,
    },
  };
  return new Promise((resolve, reject) => {
    request(options, (error, response) => {
      error ? reject(error) : resolve(JSON.parse(response.body).result);
    });
  });
}
/**
 * 使用 AK，SK 生成鉴权签名（Access Token）
 * @return string 鉴权签名信息（Access Token）
 */
function getAccessToken() {
  let options = {
    method: "POST",
    url:
      "https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=" +
      AK +
      "&client_secret=" +
      SK,
  };
  return new Promise((resolve, reject) => {
    request(options, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(JSON.parse(response.body).access_token);
      }
    });
  });
}
module.exports = main;
