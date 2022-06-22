class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this);
  }
}

const mainErrorHandler = (error, res) => {
  console.error(error);

  res.statusCode = error.statusCode;
  res.end(error.message);
};

module.exports = { mainErrorHandler, CustomError };
