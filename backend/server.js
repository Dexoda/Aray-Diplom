const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const dotenv = require('dotenv');
const Product = require('./models/Product');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// Make session available to templates
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.session.user || null;
  next();
});

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Use routes
app.use('/', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// Home route
app.get('/', async (req, res, next) => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).limit(8);
    res.render('home', { 
      title: 'Amour De Beauté - Косметика высшего качества',
      featuredProducts
    });
  } catch (error) {
    next(error);
  }
});

// Cart routes (direct implementation to avoid issues)
app.get('/cart', (req, res) => {
  if (!req.session.cart) {
    req.session.cart = { items: [], totalQty: 0, totalPrice: 0 };
  }
  res.render('cart/index', {
    title: 'Корзина',
    cart: req.session.cart
  });
});

app.post('/cart/add', async (req, res, next) => {
  try {
    const productId = req.body.productId;
    const quantity = parseInt(req.body.quantity) || 1;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Товар не найден' });
    }
    
    // Initialize cart if doesn't exist
    if (!req.session.cart) {
      req.session.cart = { items: [], totalQty: 0, totalPrice: 0 };
    }
    
    const cart = req.session.cart;
    
    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(item => item.product._id.toString() === productId);
    
    if (existingItemIndex > -1) {
      // Update existing item
      cart.items[existingItemIndex].qty += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl
        },
        qty: quantity,
        price: product.price
      });
    }
    
    // Update cart totals
    cart.totalQty = cart.items.reduce((total, item) => total + item.qty, 0);
    cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.qty), 0);
    
    // Save to session
    req.session.cart = cart;
    
    res.redirect('/cart');
  } catch (error) {
    next(error);
  }
});

// Generic error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).render('error', {
    title: 'Ошибка',
    message: err.message || 'Произошла ошибка на сервере',
    statusCode: statusCode,
    stack: process.env.NODE_ENV === 'development' ? err.stack : null
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});