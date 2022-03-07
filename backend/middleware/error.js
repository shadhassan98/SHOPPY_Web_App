const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  //Wrong mongoDb ID error...CastError
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = "JSON Web Token is invalid, Try again";
    err = new ErrorHandler(message, 400);
  }

  //JWT expire error
  if (err.name === "TokenExpiredError") {
    const message = "JSON Web Token is Expired, Try again ";
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    error: err,
    message: err.message,
  });
};
