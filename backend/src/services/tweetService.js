const { v4: uuidv4 } = require("uuid");
const { httpStatusCodes } = require("../constants");
const { CustomError } = require("../errorHandlers/mainErrorHandler");
const { dbTweetMethods } = require("../infrastructure/db/dbMethods");
const storageMethods = require("../infrastructure/storage/storageMethods");

const createTweetService = ({ author, title, message, uploadedImageName, uploadedImageExtension }) => {
  const newTweetId = uuidv4();
  dbTweetMethods.createTweet([newTweetId, author.nickname, title, message, uploadedImageName, uploadedImageExtension]);

  return `New tweet '${title}' has been created`;
};

const editTweetService = async ({ tweetId, title, message }) => {
  const tweet = await dbTweetMethods.findTweetByField("id", tweetId);
  if (!tweet) {
    throw new CustomError("Tweet doesn't exist in database", httpStatusCodes.NOT_FOUND);
  }

  if (tweet.title !== title) {
    dbTweetMethods.editTweetField(tweet.id, "title", [title]);
  }
  if (tweet.message !== message) {
    dbTweetMethods.editTweetField(tweet.id, "message", [message]);
  }
  return "Tweet was successfully edited";
};

const editTweetImageService = async ({ tweetId, uploadedImageName, uploadedImageExtension }) => {
  const tweet = await dbTweetMethods.findTweetByField("id", tweetId);

  if (!tweet) {
    throw new CustomError("Tweet doesn't exist in database", httpStatusCodes.NOT_FOUND);
  }

  storageMethods.deleteTweetImage(tweet);
  dbTweetMethods.editTweetField(tweet.id, "imageName", uploadedImageName);
  dbTweetMethods.editTweetField(tweet.id, "imageExtension", uploadedImageExtension);

  return "Tweet image is successfully updated";
};

const deleteTweetImageService = async (tweetId) => {
  const tweet = await dbTweetMethods.findTweetByField("id", tweetId);

  if (!tweet) {
    throw new CustomError("Tweet doesn't exist in database", httpStatusCodes.NOT_FOUND);
  }

  storageMethods.deleteTweetImage(tweet);
  dbTweetMethods.editTweetField(tweet.id, "imageName", null);
  dbTweetMethods.editTweetField(tweet.id, "imageExtension", null);

  return "Tweet image was successfully deleted";
};

const getTweetsService = (queryParams) => {
  if (queryParams.start && queryParams.limit) {
    return dbTweetMethods.getTweetsList(`${queryParams.start},${queryParams.limit}`);
  } else if (queryParams.limit) {
    return dbTweetMethods.getTweetsList(`${queryParams.limit}`);
  }

  return dbTweetMethods.getTweetsList();
};

const getTweetImageService = async (tweetId) => {
  const tweet = await dbTweetMethods.findTweetByField("id", tweetId);
  const imageStream = await storageMethods.getTweetImage(tweet);

  return [imageStream, tweet];
};

module.exports = {
  createTweetService,
  editTweetService,
  editTweetImageService,
  deleteTweetImageService,
  getTweetsService,
  getTweetImageService,
};
