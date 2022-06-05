const { v4: uuidv4 } = require("uuid");
const dbMethods = require("../infrastructure/db/dbMethods");
const getUserFromToken = require("../utils/getUserFromToken");

const createTweetService = async (req, res) => {
  const { title, message } = req.body;

  const author = await getUserFromToken(req);
  const newTweetId = uuidv4();
  await dbMethods.createTweet("id, author, title, message", [newTweetId, author.nickname, title, message]);
  res.end(`New tweet "${title}" has been created"`);
};

module.exports = { createTweetService };
