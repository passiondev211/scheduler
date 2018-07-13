export default (req, res, next) => {
  res.error = (message, code = 400) => res.status(code).json({
    success: false,
    error: message,
  });

  next();
};
