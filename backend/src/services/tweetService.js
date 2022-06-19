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
      await dbTweetMethods.editTweetField(tweet.id, "title", [title]);
    }
    if (tweet.message !== message) {
      await dbTweetMethods.editTweetField(tweet.id, "message", [message]);
    }
    return res.end("Tweet was successfully edited");
  }

  return res.end("Tweet doesn't exist in database");
};

const editTweetImageService = async (req, res) => {
  await storageMethods.addNewTweetImage(req);

  const tweetId = req.url.replace("/tweet/", "").replace("/image", "");
  const tweet = await dbTweetMethods.findTweetByField("id", tweetId);

  if (tweet) {
    storageMethods.deleteTweetImage(tweet);

    await dbTweetMethods.editTweetField(tweet.id, "imageName", req.body.uploadedImageName);
    await dbTweetMethods.editTweetField(tweet.id, "imageExtension", req.body.uploadedImageExtension);
    return res.end("Tweet image is successfully updated");
  }
  return res.end("Tweet doesn't exist in database");
};

const deleteTweetImageService = async (req, res) => {
  const tweetId = req.url.replace("/tweet/", "").replace("/image", "");
  const tweet = await dbTweetMethods.findTweetByField("id", tweetId);

  if (tweet) {
    await storageMethods.deleteTweetImage(tweet);
    await dbTweetMethods.editTweetField(tweet.id, "imageName", null);
    await dbTweetMethods.editTweetField(tweet.id, "imageExtension", null);
    return res.end("Tweet image is successfully deleted");
  }
  return res.end("Tweet doesn't exist in database");
};

const getTweetsService = async (req) => {
  const queryParams = {};
  req.url
    ?.split("?")[1]
    ?.split("&")
    ?.forEach((param) => {
      const parsedParam = param.split("=");
      queryParams[parsedParam[0]] = parsedParam[1];
    });

  if (queryParams.start && queryParams.limit) {
    return await dbTweetMethods.getTweetsList(`${queryParams.start},${queryParams.limit}`);
  } else if (queryParams.limit) {
    return await dbTweetMethods.getTweetsList(`${queryParams.limit}`);
  }

  return await dbTweetMethods.getTweetsList();
};

module.exports = {
  createTweetService,
  editTweetService,
  editTweetImageService,
  deleteTweetImageService,
  getTweetsService,
};
