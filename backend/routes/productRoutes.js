const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { isAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Admin routes for product management
router.get('/admin/create', isAdmin, productController.createProductForm);
router.post('/', isAdmin, productController.createProduct);
router.get('/:id/edit', isAdmin, productController.editProductForm);
router.post('/:id', isAdmin, productController.updateProduct);
router.get('/:id/delete', isAdmin, productController.deleteProduct);

module.exports = router;