const parseBody = require("./middlewares/parseBody");
const { registerUser, loginUser, getUsers, logoutUser } = require("./controllers/authController");
const checkAuth = require("./middlewares/checkAuth");
const {
  createTweet,
  editTweet,
  editTweetImage,
  deleteTweetImage,
  getTweets,
  getTweetImage,
} = require("./controllers/tweetsController");
const { httpStatusCodes } = require("./constants");
const { mainErrorHandler } = require("./errorHandlers/mainErrorHandler");

const serverBuilder = {
  methods: {
    GET: {
      "/users": {
        controller: getUsers,
        middlewares: [checkAuth],
        successCode: httpStatusCodes.OK,
      },
      "/tweets": {
        controller: getTweets,
        middlewares: [checkAuth],
        successCode: httpStatusCodes.OK,
      },
      "/tweet/:param/image": {
        controller: getTweetImage,
        middlewares: [checkAuth],
        successCode: httpStatusCodes.OK,
      },
    },
    POST: {
      "/register": {
        controller: registerUser,
        middlewares: [],
        successCode: httpStatusCodes.CREATED,
      },
      "/login": {
        controller: loginUser,
        middlewares: [],
        successCode: httpStatusCodes.OK,
      },
      "/logout": {
        controller: logoutUser,
        middlewares: [],
        successCode: httpStatusCodes.OK,
      },
      "/tweet": {
        controller: createTweet,
        middlewares: [checkAuth],
        successCode: httpStatusCodes.CREATED,
      },
    },
    PUT: {
      "/tweet/:param/image": {
        controller: editTweetImage,
        middlewares: [checkAuth],
        successCode: httpStatusCodes.OK,
      },
    },
    DELETE: {
      "/tweet/:param/image": {
        controller: deleteTweetImage,
        middlewares: [checkAuth],
        successCode: httpStatusCodes.OK,
      },
    },
    PATCH: {
      "/tweet/:param": {
        controller: editTweet,
        middlewares: [checkAuth],
        successCode: httpStatusCodes.OK,
      },
    },
  },
  generalMiddlewares: [parseBody],
  errorHandler: mainErrorHandler,
};

const serverHandlerFunction = async (req, res) => {
  let endpoint = "";
  if (req.headers["param-in-position"]) {
    const paramPositions = req.headers["param-in-position"].split(",").map((pos) => Number(pos));

    const urlWithParams = req.url
      .split("/")
      .map((path, index) => (paramPositions.includes(index) ? ":param" : path))
      .join("/");

    endpoint = serverBuilder.methods[req.method][urlWithParams];
  } else {
    endpoint = serverBuilder.methods[req.method][req.url];
  }

  if (req.url.includes("?")) {
    const urlWithoutQueryParams = req.url.split("?")[0];
    endpoint = serverBuilder.methods[req.method][urlWithoutQueryParams];
  }

  try {
    for (const generalMiddleware of serverBuilder.generalMiddlewares) {
      await generalMiddleware(req, res);
    }

    if (endpoint?.middlewares.length) {
      for (const middleware of endpoint.middlewares) {
        await middleware(req, res);
      }
    }

    if (!endpoint) {
      res.statusCode = NOT_FOUND_CODE;
      res.end("This endpoint doesn't exist");
    }

    if (res.statusCode !== httpStatusCodes.UNAUTHORIZED && res.statusCode !== httpStatusCodes.NOT_FOUND) {
      if (endpoint.controller.length > 1) {
        await endpoint.controller(req, res);
      } else {
        const result = await endpoint.controller(req);

        res.statusCode = endpoint.successCode;
        res.write(JSON.stringify(result));
        res.end();
      }
    }
  } catch (e) {
    serverBuilder.errorHandler(e, res);
  }
};

module.exports = { serverHandlerFunction, serverBuilder, httpStatusCodes };
