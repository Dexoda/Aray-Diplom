// Authentication middleware
exports.isAuth = (req, res, next) => {
    if (req.session && req.session.user) {
      return next();
    }
    res.redirect('/login');
  };
  
  // Admin authorization middleware
  exports.isAdmin = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.isAdmin) {
      return next();
    }
    return res.status(403).render('error', {
      title: 'Доступ запрещен',
      message: 'У вас нет доступа к этой странице',
      statusCode: 403
    });
  };