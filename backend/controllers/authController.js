const User = require('../models/User');

// Register a new user
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).render('auth/register', {
        error: 'Пользователь с таким email уже существует',
        values: req.body
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      phone
    });

    await user.save();

    // Generate token
    const token = user.generateAuthToken();

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: process.env.NODE_ENV === 'production'
    });

    res.redirect('/profile');
  } catch (error) {
    next(error);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).render('auth/login', {
        error: 'Неверный email или пароль',
        values: { email }
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).render('auth/login', {
        error: 'Неверный email или пароль',
        values: { email }
      });
    }

    // Generate token
    const token = user.generateAuthToken();

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: process.env.NODE_ENV === 'production'
    });

    // Redirect based on role
    if (user.role === 'admin') {
      return res.redirect('/products');
    }
    res.redirect('/profile');
  } catch (error) {
    next(error);
  }
};

// Logout user
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};

// Get user profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).render('error', {
        message: 'Пользователь не найден',
        statusCode: 404
      });
    }

    res.render('profile', {
      title: 'Профиль',
      user
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, street, city, postalCode, country } = req.body;

    // Find and update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        phone,
        address: {
          street,
          city,
          postalCode,
          country
        }
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).render('error', {
        message: 'Пользователь не найден',
        statusCode: 404
      });
    }

    res.render('profile', {
      title: 'Профиль',
      user,
      success: 'Профиль успешно обновлен'
    });
  } catch (error) {
    next(error);
  }
};

// Show register form
exports.showRegisterForm = (req, res) => {
  res.render('auth/register', {
    title: 'Регистрация',
    values: {}
  });
};

// Show login form
exports.showLoginForm = (req, res) => {
  res.render('auth/login', {
    title: 'Вход',
    values: {}
  });
};