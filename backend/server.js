// const express = require('express');
// const mongoose = require('mongoose');
// const path = require('path');
// const cookieParser = require('cookie-parser');
// const session = require('express-session');
// const morgan = require('morgan');
// const dotenv = require('dotenv');
// const Product = require('./models/Product');
// // const orderController = require('./controllers/orderController')

// // Load environment variables
// dotenv.config();
// // app.post('/cart/add', orderController.addToCart);
// // Initialize express app
// const app = express();
// const PORT = process.env.PORT || 3000;

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => console.error('MongoDB connection error:', err));

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(session({
//   secret: process.env.SESSION_SECRET || 'your_session_secret',
//   resave: false,
//   saveUninitialized: false,
//   cookie: { secure: process.env.NODE_ENV === 'production' }
// }));
// app.use(morgan('dev'));
// app.use(express.static(path.join(__dirname, 'public')));

// // Make session and user available to templates
// app.use((req, res, next) => {
//   res.locals.session = req.session;
//   res.locals.user = req.session.user || null;
//   next();
// });

// // View engine setup
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // Import routes
// const authRoutes = require('./routes/authRoutes');
// const productRoutes = require('./routes/productRoutes');
// const orderRoutes = require('./routes/orderRoutes');

// // Use routes
// app.use('/', authRoutes);
// app.use('/products', productRoutes);
// app.use('/orders', orderRoutes);

// // Маршрут для главной страницы
// app.get('/', async (req, res, next) => {
//   try {
//     const featuredProducts = await Product.find({ isFeatured: true }).limit(8);
//     res.render('home', { 
//       title: 'Amour De Beauté - Косметика высшего качества',
//       featuredProducts
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// // Алиас /cart → /orders/cart, чтобы работал привычный адрес корзины
// app.get('/cart', (req, res) => {
//   res.redirect('/orders/cart');
// });

// // Generic error handler
// app.use((err, req, res, next) => {
//   console.error('Server error:', err);
//   const statusCode = err.statusCode || 500;
//   res.status(statusCode).render('error', {
//     title: 'Ошибка',
//     message: err.message || 'Произошла ошибка на сервере',
//     statusCode: statusCode,
//     stack: process.env.NODE_ENV === 'development' ? err.stack : null
//   });
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



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

// Make session and user available to templates
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

// ВАЖНО: подключаем orderRoutes К КОРНЮ! Теперь все маршруты типа /cart, /cart/add, /checkout, /mine и т.д.
app.use('/', orderRoutes);

// Главная страница
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