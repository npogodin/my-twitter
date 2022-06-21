const http = require("http");
const { serverHandlerFunction } = require("./builder");
const { initializeDB } = require("./infrastructure/db/initializeDB");
const { initializeStorage } = require("./infrastructure/storage/initializeStorage");
require("dotenv").config();

initializeDB();
initializeStorage();

const server = http.createServer(async (req, res) => {
  await serverHandlerFunction(req, res);
});

server.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}/`);
});
