const { registerUser, loginUser, getUsers, logoutUser } = require("./controllers/authController");
const mainErrorHandler = require("./errorHandlers/mainErrorHandler");
const parseBody = require("./middlewares/parseBody");
const checkAuth = require("./middlewares/checkAuth");
const { createTweet } = require("./controllers/tweetsController");

const UNAUTHORIZED_CODE = 401;
const NOT_FOUND_CODE = 404;

const serverBuilder = {
  methods: {
    GET: {
      "/users": {
        controller: getUsers,
        middlewares: [checkAuth],
        successCode: 200,
      },
    },
    POST: {
      "/register": {
        controller: registerUser,
        middlewares: [],
        successCode: 201,
      },
      "/login": {
        controller: loginUser,
        middlewares: [],
        successCode: 200,
      },
      "/logout": {
        controller: logoutUser,
        middlewares: [],
        successCode: 200,
      },
      "/tweet": {
        controller: createTweet,
        middlewares: [checkAuth],
        successCode: 200,
      },
    },
    PUT: {},
    DELETE: {},
    PATCH: {},
  },
  generalMiddlewares: [parseBody],
  errorHandler: mainErrorHandler,
};

const serverHandlerFunction = async (req, res) => {
  const endpoint = serverBuilder.methods[req.method][req.url];

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

    if (res.statusCode !== UNAUTHORIZED_CODE && res.statusCode !== NOT_FOUND_CODE) {
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
    serverBuilder.errorHandler(e);
  }
};

module.exports = { serverHandlerFunction, serverBuilder };
