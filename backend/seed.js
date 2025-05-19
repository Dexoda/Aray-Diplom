const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const dotenv = require('dotenv');

dotenv.config();

async function seedDB() {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    
    console.log('Previous data cleared');
    
    // Create admin user
    const adminUser = new User({
      name: 'Админ',
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin'
    });
    
    await adminUser.save();
    console.log('Admin user created');
    
    // Create sample products
    const products = [
      {
        name: 'Бет теріне арналған ылғалдандырғыш крем',
        description: 'Гиалурон қышқылы мен Е дәрумені бар барлық тері түрлеріне арналған интенсивті ылғалдандырғыш крем. Ұзақ уақыт ылғалдандыру мен сыртқы әсерлерден қорғауды қамтамасыз етеді.',
        price: 2800,
        category: 'Бет күтімі',
        imageUrl: 'https://via.placeholder.com/300x300?text=Face+Cream',
        stock: 50,
        brand: 'Clarins',
        isNew: true,
        isFeatured: true
      },
      {
        name: 'Қартаюға қарсы сарысу',
        description: 'Ретинол мен пептидтер бар, қартаю белгілерімен күресуге арналған сарысу. Әжімдерді тегістейді, теріні серпімді етеді және тонусты теңестіреді.',
        price: 3500,
        category: 'Бет күтімі',
        imageUrl: 'https://via.placeholder.com/300x300?text=Anti-Age+Serum',
        stock: 30,
        brand: 'La Roche-Posay',
        isNew: false,
        isFeatured: true
      },
      {
        name: 'Мицеллярлық су',
        description: 'Барлық тері түрлеріне арналған жұмсақ мицеллярлық су. Макияжды және ластануды тиімді жояды, теріні құрғатпайды.',
        price: 950,
        category: 'Бет күтімі',
        imageUrl: 'https://via.placeholder.com/300x300?text=Micellar+Water',
        stock: 100,
        brand: 'Bioderma',
        isNew: false,
        isFeatured: false
      },
      {
        name: 'Дене теріне арналған қоректендіргіш крем',
        description: 'Ши майы мен арган майы бар сәнді дене кремі. Теріні тереңінен қоректендіреді, оны жұмсақ және жібектей етеді.',
        price: 1800,
        category: 'Дене күтімі',
        imageUrl: 'https://via.placeholder.com/300x300?text=Body+Cream',
        stock: 40,
        brand: 'L\'Occitane',
        isNew: true,
        isFeatured: false
      },
      {
        name: 'Кофе дене скрабы',
        description: 'Ұнтақталған кофе мен кокос майы бар табиғи скраб. Теріні түлетеді, тартады және целлюлитпен күреседі.',
        price: 1200,
        category: 'Дене күтімі',
        imageUrl: 'https://via.placeholder.com/300x300?text=Coffee+Scrub',
        stock: 25,
        brand: 'Natura Siberica',
        isNew: false,
        isFeatured: true
      },
      {
        name: 'SPF 30 тоналды крем',
        description: 'Күн сәулесінен қорғайтын жеңіл тоналды крем. Табиғи жабынды қамтамасыз етеді және теріге күтім жасайды.',
        price: 2500,
        category: 'Макияж',
        imageUrl: 'https://via.placeholder.com/300x300?text=Foundation',
        stock: 35,
        brand: 'Estée Lauder',
        isNew: true,
        isFeatured: true
      },
      {
        name: 'Көз кірпігіне арналған бояу палеткасы',
        description: 'Бейтараптан қанық түстерге дейін 12 түсті палетка. Жібек тәрізді текстура және жоғары пигменттелген.',
        price: 3200,
        category: 'Макияж',
        imageUrl: 'https://via.placeholder.com/300x300?text=Eyeshadow+Palette',
        stock: 20,
        brand: 'Urban Decay',
        isNew: false,
        isFeatured: true
      },
      {
        name: 'Раушан мен уд парфюмерлік суы',
        description: 'Раушан, уд, пачули және ваниль нотасы бар талғампаз әтір. Тұрақты шлейфі мен сәнді флаконы.',
        price: 5500,
        category: 'Парфюмерия',
        imageUrl: 'https://via.placeholder.com/300x300?text=Rose+Perfume',
        stock: 15,
        brand: 'Jo Malone',
        isNew: true,
        isFeatured: true
      },
      {
        name: 'Боялған шашқа арналған шампунь',
        description: 'Боялған шашқа арналған жұмсақ шампунь. Түс жарқындығын сақтайды және шаш құрылымына күтім жасайды.',
        price: 1100,
        category: 'Шаш күтімі',
        imageUrl: 'https://via.placeholder.com/300x300?text=Color+Shampoo',
        stock: 45,
        brand: 'Kerastase',
        isNew: false,
        isFeatured: false
      },
      {
        name: 'Шашты терең қалпына келтіретін маска',
        description: 'Зақымдалған шашқа арналған қарқынды қалпына келтіретін маска. Шашқа күш пен жылтырлық қайтарады.',
        price: 1900,
        category: 'Шаш күтімі',
        imageUrl: 'https://via.placeholder.com/300x300?text=Hair+Mask',
        stock: 30,
        brand: 'Moroccanoil',
        isNew: true,
        isFeatured: true
      }
    ];
    
    await Product.insertMany(products);
    console.log('Sample products created');
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Export for use in server.js
module.exports = seedDB;

// If called directly, run the seed function
if (require.main === module) {
  // Connect to MongoDB
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    return seedDB();
  })
  .then(() => {
    console.log('Seed complete, disconnecting');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error:', err);
    mongoose.disconnect();
  });
}