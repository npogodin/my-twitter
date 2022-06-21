const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { httpStatusCodes } = require("../constants");
const { CustomError } = require("../errorHandlers/mainErrorHandler");
const { dbUserMethods } = require("../infrastructure/db/dbMethods");

const createNewUserService = async (nickname, password) => {
  const oldUser = await dbUserMethods.findUserByField("nickname", nickname);
  if (oldUser) {
    throw new CustomError("User already exists. Please choose other nickname", httpStatusCodes.CONFLICT);
  }

  const newUserId = uuidv4();
  const encryptedPassword = await bcrypt.hash(password, 10);
  await dbUserMethods.createUser([newUserId, nickname, encryptedPassword]);

  return `New user ${nickname} has been created`;
};

const loginUserService = async (nickname, password) => {
  const user = await dbUserMethods.findUserByField("nickname", nickname);
  if (!user) {
    throw new CustomError("User doesn't exist", httpStatusCodes.NOT_FOUND);
  }

  const isRightPassword = await bcrypt.compare(password, user.password);
  if (!isRightPassword) {
    throw new CustomError("Wrong password", httpStatusCodes.FORBIDDEN);
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
    expiresIn: "2h",
  });

  return [user, token];
};

const getUsersListService = () => dbUserMethods.getUsersList();

module.exports = { createNewUserService, loginUserService, getUsersListService };
