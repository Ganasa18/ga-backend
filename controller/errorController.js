module.exports = (err, req, res, next) => {
  // check status code
  err.statusCode = err.statusCode || 500;
  // check error message
  err.status = err.status || "error";
  //   respone error
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
