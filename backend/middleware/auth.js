const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to check if user is authenticated
exports.isAuthenticated = async (req, res, next) => {
  try {
    // Get token from cookies or authorization header
    const token = req.cookies.token || 
                 (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    
    if (!token) {
      return res.status(401).render('error', { 
        message: 'Для доступа необходима авторизация',
        statusCode: 401
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by id
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).render('error', { 
        message: 'Пользователь не найден',
        statusCode: 401
      });
    }

    // Set user in request object
    req.user = user;
    res.locals.user = user; // Make user available to templates
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).render('error', { 
      message: 'Ошибка авторизации. Пожалуйста, войдите снова.',
      statusCode: 401
    });
  }
};

// Middleware to check if user is an admin
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  
  res.status(403).render('error', { 
    message: 'Доступ запрещен. Требуются права администратора.',
    statusCode: 403
  });
};