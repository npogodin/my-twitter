const jwt = require("jsonwebtoken");
const { dbUserMethods } = require("../infrastructure/db/dbMethods");

const getUserFromToken = async (req) => {
  if (req.headers.cookie) {
    const token = req.headers.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("token="))
      ?.replace("token=", "");

    if (token) {
      const decodedJwt = await jwt.decode(token, process.env.JWT_KEY);
      return await dbUserMethods.findUserByField("id", decodedJwt.id);
    }
  }

  return null;
};

module.exports = getUserFromToken;
