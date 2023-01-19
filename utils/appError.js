class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    // check status code
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    // capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = AppError;
