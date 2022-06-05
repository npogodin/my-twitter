const parseBody = async (req) => {
  if (req.headers["content-type"] === "application/json") {
    return new Promise((resolve, reject) => {
      let data = "";
      req.on("data", (chunk) => {
        data += String(chunk);
      });

      req.on("end", (chunk) => {
        if (chunk) {
          data += String(chunk);
        }
        if (data) {
          req.body = JSON.parse(data);
        }
        resolve();
      });

      req.on("error", () => {
        reject();
      });
    });
  }
};

module.exports = parseBody;
