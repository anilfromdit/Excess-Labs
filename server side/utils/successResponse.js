function successResponse(res, status, message, data) {
    res.status(status).json({
      status,
      message,
      data
    });
  }
  
  module.exports = successResponse;
  