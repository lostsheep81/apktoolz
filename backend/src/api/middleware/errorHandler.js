const errorHandler = (err, req, res, next) => {
  req.log.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
};

module.exports = errorHandler;