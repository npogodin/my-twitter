const { createTweetService, editTweetService, editTweetImageService } = require("../services/tweetService");
const storageMethods = require("../infrastructure/storage/storageMethods");

const createTweet = async (req, res) => {
  await storageMethods.saveTweetImage(req);

  const { title, message } = req.body;
  if (!(title && message)) {
    res.statusCode = 400;
    return res.end("All inputs are required");
  }

  return createTweetService(req, res);
};

const editTweet = async (req, res) => {
  const { title, message } = req.body;

  if (!(title && message)) {
    res.statusCode = 400;
    return res.end("All inputs are required");
  }

  return editTweetService(req, res);
};

const editTweetImage = async (req, res) => {
  await storageMethods.editTweetImage(req);

  return editTweetImageService(req, res);
};

module.exports = { createTweet, editTweet, editTweetImage };
