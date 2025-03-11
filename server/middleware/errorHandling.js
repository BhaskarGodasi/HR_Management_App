// middleware/errorMiddleware.js
// Not found middleware
exports.notFound = (req, res, next) => {
    const error = new Error(`Not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
  };
  
  // Error handler middleware
  exports.errorHandler = (err, req, res, next) => {
    // If status code is 200 but there's an error, set it to 500
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    res.status(statusCode);
    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
  };