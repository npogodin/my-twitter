const { createTweetService } = require("../services/tweetService");

const createTweet = async (req, res) => {
  const { title, message } = req.body;

  if (!(title && message)) {
    res.statusCode = 400;
    return res.end("All inputs are required");
  }

  return createTweetService(req, res);
};

module.exports = { createTweet };
