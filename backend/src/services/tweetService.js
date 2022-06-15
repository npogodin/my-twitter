const { v4: uuidv4 } = require("uuid");
const { dbTweetMethods } = require("../infrastructure/db/dbMethods");
const storageMethods = require("../infrastructure/storage/storageMethods");
const getUserFromToken = require("../utils/getUserFromToken");

const createTweetService = async (req, res) => {
  const { title, message, uploadedImageName, uploadedImageExtension } = req.body;

  const author = await getUserFromToken(req);
  const newTweetId = uuidv4();
  await dbTweetMethods.createTweet([
    newTweetId,
    author.nickname,
    title,
    message,
    uploadedImageName,
    uploadedImageExtension,
  ]);
  res.end(`New tweet "${title}" has been created"`);
};

const editTweetService = async (req, res) => {
  const { title, message } = req.body;

  const tweetId = req.url.replace("/tweet/", "");
  const tweet = await dbTweetMethods.findTweetByField("id", tweetId);
  if (tweet) {
    if (tweet.title !== title) {
      dbTweetMethods.editTweetField(tweet.id, "title", [title]);
    }
    if (tweet.message !== message) {
      dbTweetMethods.editTweetField(tweet.id, "message", [message]);
    }
    return res.end("Tweet was successfully edited");
  }

  return res.end("Tweet doesn't exist in database");
};

const editTweetImageService = async (req, res) => {
  const tweetId = req.url.replace("/tweet/", "").replace("/image", "");
  const tweet = await dbTweetMethods.findTweetByField("id", tweetId);

  if (tweet) {
    storageMethods.deleteTweetImage(tweet);

    dbTweetMethods.editTweetField(tweet.id, "imageName", req.body.uploadedImageName);
    dbTweetMethods.editTweetField(tweet.id, "imageExtension", req.body.uploadedImageExtension);
    return res.end("Tweet image was successfully updated");
  }
  return res.end("Tweet doesn't exist in database");
};

module.exports = { createTweetService, editTweetService, editTweetImageService };
