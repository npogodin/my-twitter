const { getDbConnection } = require("../../infrastructure/db/initializeDB");

const dbUserMethods = {
  findUserByField: async (field, value) => {
    const dbConnection = await getDbConnection();
    const [[user]] = await dbConnection.query("SELECT * FROM users WHERE ?? = ?", [field, value]);
    return user;
  },
  createUser: async (values) => {
    const dbConnection = await getDbConnection();
    await dbConnection.query("INSERT INTO users (id, nickname, password) VALUES(?)", [values]);
  },
  getUsersList: async () => {
    const dbConnection = await getDbConnection();
    const [users] = await dbConnection.query("SELECT id, nickname FROM users");
    return users;
  },
};

const dbTweetMethods = {
  findTweetByField: async (field, value) => {
    const dbConnection = await getDbConnection();
    const [[tweet]] = await dbConnection.query("SELECT * FROM tweets WHERE ?? = ?", [field, value]);
    return tweet;
  },
  createTweet: async (values) => {
    const dbConnection = await getDbConnection();
    await dbConnection.query("INSERT INTO tweets (id, author, title, message, imageName, imageExtension) VALUES(?)", [
      values,
    ]);
  },
  editTweetField: async (id, field, value) => {
    const dbConnection = await getDbConnection();
    await dbConnection.query(`UPDATE tweets SET ${field}=? WHERE id="${id}"`, [value]);
  },
};

module.exports = { dbUserMethods, dbTweetMethods };
