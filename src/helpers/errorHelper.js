function createError(statusCode, message) {
  const error = new Error(message);
  error.status_code = statusCode;
  return error;
}

function createBadRequestError(message = "Bad Request") {
  return createError(400, message);
}

function createNotFoundError(message = "Not Found") {
  return createError(404, message);
}

export { createError, createBadRequestError, createNotFoundError };
