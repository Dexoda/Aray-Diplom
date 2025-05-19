const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    
    // Check if headers are already sent
    if (res.headersSent) {
      return next(err);
    }
  
    // Default error code and message
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Внутренняя ошибка сервера';
  
    // Handle MongoDB validation errors
    if (err.name === 'ValidationError') {
      statusCode = 400;
      const errors = Object.values(err.errors).map(val => val.message);
      message = `Ошибка валидации: ${errors.join(', ')}`;
    }
  
    // Handle MongoDB duplicate key errors
    if (err.code === 11000) {
      statusCode = 400;
      message = 'Дублирующееся значение для уникального поля';
    }
  
    // Handle invalid token errors
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Ошибка авторизации. Пожалуйста, войдите снова.';
    }
  
    // Respond with JSON or render an error page based on request
    const accepts = req.accepts(['html', 'json']);
    
    if (accepts === 'json') {
      return res.status(statusCode).json({
        success: false,
        error: message
      });
    } else {
      return res.status(statusCode).render('error', {
        message: message,
        statusCode: statusCode,
        stack: process.env.NODE_ENV === 'development' ? err.stack : null
      });
    }
  };
  
  module.exports = errorHandler;