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
