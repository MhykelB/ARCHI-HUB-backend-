const errorHandler = (err, req, res, next) => {
  const defaultError = {
    statusCode: err.statusCode || 400,
    message: err.message || "pele my dear, something went wrong",
  };

  res.status(defaultError.statusCode).json(defaultError.message);
};

module.exports = errorHandler;
