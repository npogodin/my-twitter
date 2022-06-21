const { httpStatusCodes } = require("../constants");
const { CustomError } = require("../errorHandlers/mainErrorHandler");
const { createNewUserService, loginUserService, getUsersListService } = require("../services/authService");

const registerUser = (req) => {
  const { nickname, password } = req.body;

  if (!(nickname && password)) {
    throw new CustomError("All inputs are required", httpStatusCodes.BAD_REQUEST);
  }

  return createNewUserService(nickname, password);
};

const loginUser = async (req, res) => {
  const { nickname, password } = req.body;

  if (!(nickname && password)) {
    throw new CustomError("All inputs are required", httpStatusCodes.BAD_REQUEST);
  }

  const [user, token] = await loginUserService(nickname, password);

  res.setHeader("Set-Cookie", `token=${token}; Max-Age=7200; HttpOnly, Secure`);
  res.statusCode = httpStatusCodes.OK;
  res.end(`${user.nickname}, you have been successfully logged in`);
};

const logoutUser = async (req, res) => {
  res.setHeader("Set-Cookie", "token=");
  res.end("You have been successfully logged out");
};

const getUsers = () => {
  return getUsersListService();
};

module.exports = { registerUser, loginUser, logoutUser, getUsers };
