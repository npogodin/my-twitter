const { createNewUserService, loginUserService, getUsersListService } = require("../services/authService");

const registerUser = async (req, res) => {
  const { nickname, password } = req.body;

  if (!(nickname && password)) {
    res.statusCode = 400;
    return res.end("All inputs are required");
  }

  return createNewUserService(req, res);
};

const loginUser = async (req, res) => {
  const { nickname, password } = req.body;

  if (!(nickname && password)) {
    res.statusCode = 400;
    return res.end("All inputs are required");
  }

  return loginUserService(req, res);
};

const logoutUser = async (req, res) => {
  res.setHeader("Set-Cookie", "token=");
  res.end("You have been successfully logged out");
};

const getUsers = async () => {
  return await getUsersListService();
};

module.exports = { registerUser, loginUser, logoutUser, getUsers };
