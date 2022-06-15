const fs = require("fs");

const migrationsFolder = "./src/infrastructure/db/migrations/";

const migrateDB = async (dbConnection) => {
  fs.readdir(migrationsFolder, (err, files) => {
    files.forEach(async (file) => {
      const [migrationInDb] = await dbConnection.query("SELECT * FROM migrations WHERE ?? = ?", ["name", file]);

      if (!migrationInDb.length) {
        fs.readFile(`${migrationsFolder}${file}`, "utf8", async (err, data) => {
          await dbConnection.query(data);
        });
        await dbConnection.query("INSERT INTO migrations (??) VALUES(?)", ["name", file]);
        console.log("Migrated with file: ", file);
      }
    });
  });
};

module.exports = migrateDB;
