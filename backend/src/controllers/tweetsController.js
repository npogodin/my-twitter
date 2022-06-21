const {
  createTweetService,
  editTweetService,
  editTweetImageService,
  deleteTweetImageService,
  getTweetsService,
  getTweetImageService,
} = require("../services/tweetService");
const storageMethods = require("../infrastructure/storage/storageMethods");
const { CustomError } = require("../errorHandlers/mainErrorHandler");
const { httpStatusCodes } = require("../constants");
const getUserFromToken = require("../utils/getUserFromToken");

const createTweet = async (req) => {
  await storageMethods.saveTweetImage(req);

  const { title, message, uploadedImageName, uploadedImageExtension } = req.body;
  if (!(title && message)) {
    throw new CustomError("All inputs are required", httpStatusCodes.BAD_REQUEST);
  }
  const author = await getUserFromToken(req);

  return createTweetService({ author, title, message, uploadedImageName, uploadedImageExtension });
};

const editTweet = (req) => {
  const { title, message } = req.body;

  if (!(title && message)) {
    throw new CustomError("All inputs are required", httpStatusCodes.BAD_REQUEST);
  }

  const tweetId = req.url.replace("/tweet/", "");

  return editTweetService({ tweetId, title, message });
};

const editTweetImage = async (req) => {
  await storageMethods.addNewTweetImage(req);

  const tweetId = req.url.replace("/tweet/", "").replace("/image", "");
  const { uploadedImageName, uploadedImageExtension } = req.body;

  return editTweetImageService({ tweetId, uploadedImageName, uploadedImageExtension });
};

const deleteTweetImage = (req) => {
  const tweetId = req.url.replace("/tweet/", "").replace("/image", "");

  return deleteTweetImageService(tweetId);
};

const getTweetImage = async (req, res) => {
  const tweetId = req.url.replace("/tweet/", "").replace("/image", "");

  const [imageStream, tweet] = await getTweetImageService(tweetId);

  res.setHeader("Content-Type", `image/${tweet.imageExtension}`);
  res.statusCode = httpStatusCodes.OK;
  imageStream.pipe(res);
};

const getTweets = (req) => {
  const queryParams = {};
  req.url
    ?.split("?")[1]
    ?.split("&")
    ?.forEach((param) => {
      const parsedParam = param.split("=");
      queryParams[parsedParam[0]] = parsedParam[1];
    });

  return getTweetsService(queryParams);
};

module.exports = { createTweet, editTweet, editTweetImage, deleteTweetImage, getTweets, getTweetImage };
