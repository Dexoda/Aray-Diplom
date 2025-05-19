const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Өнім атауы міндетті'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Өнім сипаттамасы міндетті']
  },
  price: {
    type: Number,
    required: [true, 'Өнім бағасы міндетті'],
    min: [0, 'Баға теріс болмауы керек']
  },
  category: {
    type: String,
    required: [true, 'Өнім санаты міндетті'],
    enum: {
      values: ['Бет күтімі', 'Дене күтімі', 'Макияж', 'Парфюмерия', 'Шаш күтімі'],
      message: '`{VALUE}` жарамсыз санат'
    }
  },
  imageUrl: {
    type: String,
    required: [true, 'Өнім суреті міндетті']
  },
  stock: {
    type: Number,
    required: [true, 'Қоймадағы саны міндетті'],
    min: [0, 'Саны теріс болмауы керек'],
    default: 10
  },
  brand: {
    type: String,
    required: [true, 'Өнім бренді міндетті']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isNew: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  }
});

// Create text index for search
productSchema.index({ 
  name: 'text', 
  description: 'text', 
  brand: 'text',
  category: 'text'
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;