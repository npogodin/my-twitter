const fs = require("fs");
const { findMigrationQuery, addMigrationQuery } = require("./dbQueries");

const migrationsFolder = "./src/infrastructure/db/migrations/";

const migrateDB = async (dbConnection) => {
  fs.readdir(migrationsFolder, (err, files) => {
    files.forEach(async (file) => {
      const [migrationInDb] = await dbConnection.query(findMigrationQuery("name", file));

      if (!migrationInDb.length) {
        console.log("Migrated with file: ", file);
        fs.readFile(`${migrationsFolder}${file}`, "utf8", async (err, data) => {
          await dbConnection.query(data);
        });
        await dbConnection.query(addMigrationQuery("name", [file]));
      }
    });
  });
};

module.exports = migrateDB;
