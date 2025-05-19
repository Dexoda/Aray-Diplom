const Order = require('../models/Order');
const Product = require('../models/Product');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Show checkout form
exports.showCheckoutForm = async (req, res, next) => {
  try {
    // Get cart from session or default to empty array
    const cart = req.session.cart || [];
    
    if (cart.length === 0) {
      return res.redirect('/products');
    }
    
    // Get product details for items in cart
    const items = [];
    let totalAmount = 0;
    
    for (const item of cart) {
      const product = await Product.findById(item.productId);
      if (product) {
        const itemTotal = product.price * item.quantity;
        items.push({
          product,
          quantity: item.quantity,
          total: itemTotal
        });
        totalAmount += itemTotal;
      }
    }
    
    res.render('orders/checkout', {
      title: 'Оформление заказа',
      items,
      totalAmount,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

// Create a new order
exports.createOrder = async (req, res, next) => {
  try {
    // Get cart from session
    const cart = req.session.cart || [];
    
    if (cart.length === 0) {
      return res.redirect('/products');
    }
    
    const { name, street, city, postalCode, country, phone, paymentMethod } = req.body;
    
    // Prepare items for order
    const orderItems = [];
    let totalAmount = 0;
    
    for (const item of cart) {
      const product = await Product.findById(item.productId);
      if (product) {
        const itemTotal = product.price * item.quantity;
        orderItems.push({
          product: product._id,
          name: product.name,
          quantity: item.quantity,
          price: product.price,
          imageUrl: product.imageUrl
        });
        totalAmount += itemTotal;
        
        // Update product stock
        await Product.findByIdAndUpdate(product._id, {
          $inc: { stock: -item.quantity }
        });
      }
    }
    
    // Create new order
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      shippingAddress: {
        name,
        street,
        city,
        postalCode,
        country,
        phone
      },
      totalAmount,
      paymentMethod,
      isPaid: paymentMethod !== 'Наличные', // Assume paid if not cash
      paidAt: paymentMethod !== 'Наличные' ? Date.now() : null
    });
    
    await order.save();
    
    // Clear cart
    req.session.cart = [];
    
    res.redirect(`/orders/${order._id}/invoice`);
  } catch (error) {
    next(error);
  }
};

// Get all orders (admin only)
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    res.render('orders/all-orders', {
      title: 'Все заказы',
      orders
    });
  } catch (error) {
    next(error);
  }
};

// Get orders for current user
exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    
    res.render('orders/my-orders', {
      title: 'Мои заказы',
      orders
    });
  } catch (error) {
    next(error);
  }
};

// Get invoice for an order
exports.getInvoice = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email');
    
    if (!order) {
      return res.status(404).render('error', {
        message: 'Заказ не найден',
        statusCode: 404
      });
    }
    
    // Check if user is owner or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).render('error', {
        message: 'Доступ запрещен',
        statusCode: 403
      });
    }
    
    // If format is PDF, generate PDF invoice
    if (req.query.format === 'pdf') {
      return generatePdfInvoice(order, res);
    }
    
    // Otherwise render HTML invoice
    res.render('orders/invoice', {
      title: `Чек #${order.orderNumber}`,
      order
    });
  } catch (error) {
    next(error);
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).render('error', {
        message: 'Заказ не найден',
        statusCode: 404
      });
    }
    
    res.redirect('/orders');
  } catch (error) {
    next(error);
  }
};

// Add product to cart
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const qty = parseInt(quantity) || 1;
    
    // Get product to check stock
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Товар не найден'
      });
    }
    
    if (product.stock < qty) {
      return res.status(400).json({
        success: false,
        message: 'Недостаточное количество товара на складе'
      });
    }
    
    // Initialize cart if it doesn't exist
    if (!req.session.cart) {
      req.session.cart = [];
    }
    
    // Check if product already in cart
    const cartItemIndex = req.session.cart.findIndex(item => item.productId === productId);
    
    if (cartItemIndex > -1) {
      // Update quantity if product already in cart
      req.session.cart[cartItemIndex].quantity += qty;
    } else {
      // Add new item to cart
      req.session.cart.push({
        productId,
        quantity: qty
      });
    }
    
    res.redirect('/cart');
  } catch (error) {
    next(error);
  }
};

// View cart
exports.viewCart = async (req, res, next) => {
  try {
    // Get cart from session
    const cart = req.session.cart || [];
    
    // Get product details for items in cart
    const items = [];
    let totalAmount = 0;
    
    for (const item of cart) {
      const product = await Product.findById(item.productId);
      if (product) {
        const itemTotal = product.price * item.quantity;
        items.push({
          product,
          quantity: item.quantity,
          total: itemTotal
        });
        totalAmount += itemTotal;
      }
    }
    
    res.render('orders/cart', {
      title: 'Корзина',
      items,
      totalAmount
    });
  } catch (error) {
    next(error);
  }
};

// Remove item from cart
exports.removeFromCart = (req, res) => {
  const { productId } = req.params;
  
  if (req.session.cart) {
    req.session.cart = req.session.cart.filter(item => item.productId !== productId);
  }
  
  res.redirect('/cart');
};

// Generate PDF invoice
function generatePdfInvoice(order, res) {
  // Create a document
  const doc = new PDFDocument({ margin: 50 });
  
  // Set response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="invoice-${order.orderNumber}.pdf"`);
  
  // Pipe the PDF to the response
  doc.pipe(res);
  
  // Add company logo
  doc.image(path.join(__dirname, '../public/images/logo.png'), 50, 45, { width: 100 })
    .fillColor('#333')
    .fontSize(20)
    .text('Amour De Beauté', 200, 65)
    .fontSize(10)
    .text('Интернет-магазин косметики', 200, 90)
    .moveDown();
  
  // Add invoice details
  doc.fontSize(18)
    .text('ЧЕК', { align: 'center' })
    .moveDown()
    .fontSize(12)
    .text(`Номер заказа: ${order.orderNumber}`, { align: 'right' })
    .text(`Дата: ${new Date(order.createdAt).toLocaleDateString('ru-RU')}`, { align: 'right' })
    .moveDown();
  
  // Add customer info
  doc.fontSize(14)
    .text('Данные клиента:', { underline: true })
    .fontSize(12)
    .moveDown(0.5)
    .text(`Имя: ${order.shippingAddress.name}`)
    .text(`Адрес: ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`)
    .text(`Страна: ${order.shippingAddress.country}`)
    .text(`Телефон: ${order.shippingAddress.phone}`)
    .moveDown();
  
  // Add table header
  doc.fontSize(12)
    .text('Товар', 50, 300)
    .text('Количество', 300, 300)
    .text('Цена', 350, 300)
    .text('Сумма', 400, 300)
    .moveTo(50, 315)
    .lineTo(550, 315)
    .stroke()
    .moveDown();
  
  // Add table rows
  let y = 330;
  let total = 0;
  
  order.items.forEach(item => {
    doc.text(item.name, 50, y, { width: 240 })
      .text(item.quantity.toString(), 300, y)
      .text(`${item.price.toFixed(2)} ₽`, 350, y)
      .text(`${(item.price * item.quantity).toFixed(2)} ₽`, 400, y);
      
    total += item.price * item.quantity;
    y += 30;
    
    if (y > 700) {
      doc.addPage();
      y = 50;
    }
  });
  
  // Add total
  doc.moveTo(50, y)
    .lineTo(550, y)
    .stroke()
    .moveDown()
    .text(`Итого: ${total.toFixed(2)} ₽`, 400, y + 20)
    .text(`Способ оплаты: ${order.paymentMethod}`, 50, y + 20)
    .text(`Статус оплаты: ${order.isPaid ? 'Оплачено' : 'Не оплачено'}`, 50, y + 40)
    .moveDown(2);
  
  // Add footer
  doc.fontSize(10)
    .text('Спасибо за ваш заказ!', { align: 'center' })
    .text('Amour De Beauté - Косметика высшего качества', { align: 'center' })
    .text('© 2025 Все права защищены', { align: 'center' });
  
  // Finalize the PDF
  doc.end();
}