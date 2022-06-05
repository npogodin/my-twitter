const findMigrationQuery = (field, value) => `SELECT * FROM migrations WHERE ${field} = "${value}"`;

const addMigrationQuery = (fields, values) =>
  `INSERT INTO migrations (${fields}) VALUES(${values.map((value) => `'${value}'`).join(",")})`;

const findUserQuery = (field, value) => `SELECT * FROM users WHERE ${field} = "${value}"`;

const addUserQuery = (fields, values) =>
  `INSERT INTO users (${fields}) VALUES(${values.map((value) => `'${value}'`).join(",")})`;

const addTweetQuery = (fields, values) =>
  `INSERT INTO tweets (${fields}) VALUES(${values.map((value) => `'${value}'`).join(",")})`;

module.exports = { findMigrationQuery, addMigrationQuery, findUserQuery, addUserQuery, addTweetQuery };
