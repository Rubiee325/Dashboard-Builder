/**
 * Robust Backend Error Handler
 */
const errorHandler = (err, req, res, next) => {
  // Handle Mongoose Validation Errors
  if (err.name === 'ValidationError' || err.errors) {
    const errorMessages = {};
    
    if (err.errors) {
      for (const key in err.errors) {
        if (Object.prototype.hasOwnProperty.call(err.errors, key)) {
          errorMessages[key] = err.errors[key].message || 'Please fill the field';
        }
      }
    } else {
      errorMessages['general'] = err.message || 'Please fill the field';
    }
    
    return res.status(400).json({
      success: false,
      message: 'Validation Failed',
      errors: errorMessages
    });
  }

  // Handle other errors
  const statusCode = err.status || 500;
  console.error(`[Error] ${err.message}`);
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
