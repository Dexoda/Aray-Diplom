const Product = require('../models/Product');

// Get all products with filtering, sorting, and pagination
exports.getAllProducts = async (req, res, next) => {
  try {
    console.log('Received query params:', req.query);
    
    // Query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    // Filtering
    const filter = {};
    
    if (req.query.category && req.query.category.trim() !== '') {
      filter.category = req.query.category.trim();
    }
    
    if (req.query.priceMin || req.query.priceMax) {
      filter.price = {};
      
      if (req.query.priceMin && !isNaN(parseInt(req.query.priceMin))) {
        filter.price.$gte = parseInt(req.query.priceMin);
      }
      
      if (req.query.priceMax && !isNaN(parseInt(req.query.priceMax))) {
        filter.price.$lte = parseInt(req.query.priceMax);
      }
    }
    
    // Search
    if (req.query.search && req.query.search.trim() !== '') {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { brand: searchRegex }
      ];
    }
    
    console.log('Filter query:', filter);
    
    // Sorting
    let sort = {};
    switch(req.query.sort) {
      case 'price_asc':
        sort = { price: 1 };
        break;
      case 'price_desc':
        sort = { price: -1 };
        break;
      case 'name_asc':
        sort = { name: 1 };
        break;
      case 'name_desc':
        sort = { name: -1 };
        break;
      default:
        sort = { createdAt: -1 }; // newest by default
    }
    
    // Get categories for filter sidebar
    const categories = await Product.distinct('category');
    
    // Execute query
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    
    console.log('Found products:', products.length);
    
    // Render products page
    res.render('products/index', {
      title: 'Каталог косметики',
      products,
      currentPage: page,
      totalPages,
      totalProducts: total,
      limit,
      query: req.query,
      categories
    });
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    next(error);
  }
};

// Get single product by ID
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).render('error', {
        title: 'Ошибка',
        message: 'Товар не найден',
        statusCode: 404
      });
    }
    
    // Get related products (same category, excluding current product)
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(4);
    
    res.render('products/show', {
      title: product.name,
      product,
      relatedProducts
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Create product form
exports.createProductForm = async (req, res) => {
  res.render('products/create', {
    title: 'Добавить товар'
  });
};

// Admin: Create product
exports.createProduct = async (req, res, next) => {
  try {
    const productData = {
      name: req.body.name,
      brand: req.body.brand,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      imageUrl: req.body.imageUrl,
      isNew: req.body.isNew === 'on',
      isFeatured: req.body.isFeatured === 'on'
    };
    
    const product = await Product.create(productData);
    
    res.redirect(`/products/${product._id}`);
  } catch (error) {
    console.error('Error creating product:', error);
    
    if (error.name === 'ValidationError') {
      return res.render('products/create', {
        title: 'Добавить товар',
        error: Object.values(error.errors).map(e => e.message).join(', '),
        values: req.body
      });
    }
    
    next(error);
  }
};

// Admin: Edit product form
exports.editProductForm = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).render('error', {
        title: 'Ошибка',
        message: 'Товар не найден',
        statusCode: 404
      });
    }
    
    res.render('products/edit', {
      title: `Редактирование: ${product.name}`,
      product
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update product
exports.updateProduct = async (req, res, next) => {
  try {
    const productData = {
      name: req.body.name,
      brand: req.body.brand,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      imageUrl: req.body.imageUrl,
      isNew: req.body.isNew === 'on',
      isFeatured: req.body.isFeatured === 'on'
    };
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).render('error', {
        title: 'Ошибка',
        message: 'Товар не найден',
        statusCode: 404
      });
    }
    
    res.redirect(`/products/${product._id}`);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const product = { _id: req.params.id, ...req.body };
      return res.render('products/edit', {
        title: `Редактирование: ${product.name}`,
        product,
        error: Object.values(error.errors).map(e => e.message).join(', ')
      });
    }
    
    next(error);
  }
};

// Admin: Delete product
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).render('error', {
        title: 'Ошибка',
        message: 'Товар не найден',
        statusCode: 404
      });
    }
    
    res.redirect('/products');
  } catch (error) {
    next(error);
  }
};