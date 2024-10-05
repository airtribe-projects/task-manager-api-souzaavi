
/**
 * Express middleware function for handling errors.
 *
 * This middleware logs the error, determines the appropriate HTTP status code
 * based on the error message, and sends an error response in JSON format.
 *
 * @param {Error} error - The error object.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function.

 */
const errorHandler = (error, req, res, next) => {
  console.error(error);
  let statusCode = 500;
  const message = error.message.toString();
  if(message.toLowerCase().includes('unable to find task')) {
    statusCode = 404;
  }
  if(message.toLowerCase().includes('bad request') || message.toLowerCase().includes('invalid input')) {
    statusCode = 400;
  }
  res.status(statusCode).json({error: error.message});
}

module.exports = errorHandler;
