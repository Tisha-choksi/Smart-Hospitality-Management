const sendResponse = (res, statusCode, success, message, data = null) => {
  res.status(statusCode).json({
    success,
    message,
    data,
  });
};

const successResponse = (res, data, message = 'Success') => {
  sendResponse(res, 200, true, message, data);
};

const errorResponse = (res, statusCode, message) => {
  sendResponse(res, statusCode, false, message);
};

module.exports = { sendResponse, successResponse, errorResponse };