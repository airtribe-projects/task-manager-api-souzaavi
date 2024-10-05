/**
 * Middleware to validate the 'id' parameter in the request.
 *
 * Ensures that the 'id' parameter is a valid positive integer.
 * If valid, continues to the next middleware.
 * If invalid, it passes an error to the next middleware function.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID parameter to validate.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 *
 * @returns {void}
 */
const validateId = (req, res, next) => {
  const {id} = req.params;
  const taskId = parseInt(id);
  if(isNaN(taskId) || taskId <= 0) {
    next(
      new Error('Invalid Input: id should be a valid positive integer value')
    );
  }
  next();
}

module.exports = validateId;
