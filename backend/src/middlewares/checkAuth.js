const jwt = require("jsonwebtoken");

const checkAuth = (req, res) => {
  if (req.headers.cookie) {
    const token = req.headers.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("token="))
      ?.replace("token=", "");

    if (token || token === "") {
      jwt.verify(token, process.env.JWT_KEY, (err, decode) => {
        if (!err) return;
        res.statusCode = 401;
        return res.end("Your token has expired, please sign in again");
      });
    }
  } else {
    res.statusCode = 401;
    return res.end("Please sign in");
  }
};

module.exports = checkAuth;
