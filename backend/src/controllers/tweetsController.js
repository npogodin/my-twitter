const {
  createTweetService,
  editTweetService,
  editTweetImageService,
  deleteTweetImageService,
  getTweetsService,
} = require("../services/tweetService");
const storageMethods = require("../infrastructure/storage/storageMethods");

const createTweet = async (req, res) => {
  await storageMethods.saveTweetImage(req);

  const { title, message } = req.body;
  if (!(title && message)) {
    res.statusCode = 400;
    return res.end("All inputs are required");
  }

  return await createTweetService(req, res);
};

const editTweet = async (req, res) => {
  const { title, message } = req.body;

  if (!(title && message)) {
    res.statusCode = 400;
    return res.end("All inputs are required");
  }

  return await editTweetService(req, res);
};

const editTweetImage = async (req, res) => await editTweetImageService(req, res);

const deleteTweetImage = async (req, res) => await deleteTweetImageService(req, res);

const getTweets = async (req) => await getTweetsService(req);

module.exports = { createTweet, editTweet, editTweetImage, deleteTweetImage, getTweets };
