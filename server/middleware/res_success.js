export default (req, res, next) => {
  res.success = (obj, code = 200) => {
    if (obj && typeof obj.toJSON === 'function') {
      obj = obj.toJSON(); // eslint-disable-line no-param-reassign
    }

    return res.status(code).json(Object.assign({
      success: true,
    }, obj));
  };

  next();
};
