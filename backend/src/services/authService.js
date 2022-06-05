const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const dbMethods = require("../infrastructure/db/dbMethods");

const createNewUserService = async (req, res) => {
  const { nickname, password } = req.body;

  const oldUser = await dbMethods.findUserByField("nickname", nickname);
  if (oldUser) {
    res.statusCode = 409;
    return res.end("User already exists. Please login");
  }

  const newUserId = uuidv4();
  const encryptedPassword = await bcrypt.hash(password, 10);
  await dbMethods.createUser("id, nickname, password", [newUserId, nickname, encryptedPassword]);

  res.statusCode = 201;
  return res.end(`New user ${nickname} has been created`);
};

const loginUserService = async (req, res) => {
  const { nickname, password } = req.body;

  const user = await dbMethods.findUserByField("nickname", nickname);
  if (!user) {
    res.statusCode = 404;
    return res.end("User doesn't exist");
  }

  const isRightPassword = await bcrypt.compare(password, user.password);
  if (!isRightPassword) {
    res.statusCode = 403;
    return res.end("Wrong password");
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
    expiresIn: "2h",
  });

  res.setHeader("Set-Cookie", `token=${token}; Max-Age=7200; HttpOnly, Secure`);
  res.statusCode = 200;
  return res.end(`${user.nickname}, you have been successfully logged in`);
};

const getUsersListService = async () => await dbMethods.getUsersList();

module.exports = { createNewUserService, loginUserService, getUsersListService };
