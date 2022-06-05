const mysql2 = require("mysql2/promise");
const migrateDB = require("./migrateDB");

let connection = null;

const getDbConnection = async () => {
  if (connection) {
    return connection;
  }

  const dbConnection = await mysql2.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER_NAME,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });

  await dbConnection.connect(function (err) {
    if (err) throw err;
    console.log("Connected to DB!");
  });

  connection = dbConnection;
  return dbConnection;
};

const initializeDB = async () => {
  const dbConnection = await getDbConnection();

  await dbConnection.query("CREATE TABLE IF NOT EXISTS migrations (name VARCHAR(255))");
  await migrateDB(dbConnection);
};

module.exports = { initializeDB, getDbConnection };
