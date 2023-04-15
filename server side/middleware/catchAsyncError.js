module.exports = (handleAsync) => (req, res, next) => {
  Promise.resolve(handleAsync(req, res, next)).catch((err) => {
    try {
      console.log(err)
      throw err;
    } catch (e) {
      console.error(e.stack);
      next(e);
    }
  });
};
