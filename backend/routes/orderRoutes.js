// const express = require('express');
// const router = express.Router();
// const orderController = require('../controllers/orderController');
// const { isAuthenticated, isAdmin } = require('../middleware/auth');

// // Cart routes (корзина)
// router.get('/cart', orderController.viewCart);
// router.post('/cart/add', orderController.addToCart);
// router.get('/cart/remove/:productId', orderController.removeFromCart);

// // Checkout routes (оформление заказа)
// router.get('/checkout', isAuthenticated, orderController.showCheckoutForm);
// router.post('/checkout', isAuthenticated, orderController.createOrder);

// // Order routes (просмотр заказов)
// router.get('/', isAuthenticated, isAdmin, orderController.getAllOrders); // Все заказы (админ)
// router.get('/mine', isAuthenticated, orderController.getUserOrders); // Мои заказы
// router.get('/:id/invoice', isAuthenticated, orderController.getInvoice); // Чек по заказу
// router.post('/:id/status', isAuthenticated, isAdmin, orderController.updateOrderStatus); // Изменение статуса заказа

// module.exports = router;


const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Cart routes
router.get('/cart', orderController.viewCart);
router.post('/cart/add', orderController.addToCart);
router.get('/cart/remove/:productId', orderController.removeFromCart);

// Checkout
router.get('/checkout', isAuthenticated, orderController.showCheckoutForm);
router.post('/checkout', isAuthenticated, orderController.createOrder);

// Orders
router.get('/admin/orders', isAuthenticated, isAdmin, orderController.getAllOrders); // Все заказы (админ)
router.get('/mine', isAuthenticated, orderController.getUserOrders); // Мои заказы
router.get('/:id/invoice', isAuthenticated, orderController.getInvoice); // Чек по заказу
router.post('/:id/status', isAuthenticated, isAdmin, orderController.updateOrderStatus); // Изменение статуса заказа

module.exports = router;