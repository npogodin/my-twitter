const { getDbConnection } = require("../../infrastructure/db/initializeDB");
const { findUserQuery, addUserQuery, addTweetQuery } = require("./dbQueries");

const dbMethods = {
  findUserByField: async (field, value) => {
    const dbConnection = await getDbConnection();
    const [[user]] = await dbConnection.query(findUserQuery(field, value));
    return user;
  },
  createUser: async (fields, values) => {
    const dbConnection = await getDbConnection();
    await dbConnection.query(addUserQuery(fields, values));
  },
  getUsersList: async () => {
    const dbConnection = await getDbConnection();
    const [users] = await dbConnection.query("SELECT id, nickname FROM users");
    return users;
  },
  createTweet: async (fields, values) => {
    const dbConnection = await getDbConnection();
    await dbConnection.query(addTweetQuery(fields, values));
  },
};

module.exports = dbMethods;
