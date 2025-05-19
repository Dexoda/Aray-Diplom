const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Cart routes
router.get('/cart', orderController.viewCart);
router.post('/cart/add', orderController.addToCart);
router.get('/cart/remove/:productId', orderController.removeFromCart);

// Checkout routes
router.get('/checkout', isAuthenticated, orderController.showCheckoutForm);
router.post('/checkout', isAuthenticated, orderController.createOrder);

// Order routes
router.get('/', isAuthenticated, isAdmin, orderController.getAllOrders);
router.get('/mine', isAuthenticated, orderController.getUserOrders);
router.get('/:id/invoice', isAuthenticated, orderController.getInvoice);
router.post('/:id/status', isAuthenticated, isAdmin, orderController.updateOrderStatus);

module.exports = router;