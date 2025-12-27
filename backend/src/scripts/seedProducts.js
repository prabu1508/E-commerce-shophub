 require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/product');

// Sample products with images from Unsplash
const sampleProducts = [
  {
    title: "Wireless Bluetooth Headphones",
    description: "Premium noise-cancelling wireless headphones with superior sound quality and 30-hour battery life. Perfect for music lovers and professionals.",
    price: 2999,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop"
    ],
    category: "electronics",
    brand: "SoundMax",
    stock: 50,
    rating: 4.5,
    numReviews: 128
  },
  {
    title: "Smart Fitness Watch",
    description: "Track your fitness goals with this advanced smartwatch featuring heart rate monitoring, GPS, and 7-day battery life.",
    price: 8999,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=800&h=800&fit=crop"
    ],
    category: "electronics",
    brand: "FitTech",
    stock: 30,
    rating: 4.8,
    numReviews: 256
  },
  {
    title: "Classic Cotton T-Shirt",
    description: "Comfortable 100% cotton t-shirt in classic fit. Available in multiple colors. Perfect for everyday wear.",
    price: 599,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&h=800&fit=crop"
    ],
    category: "clothing",
    brand: "FashionCo",
    stock: 100,
    rating: 4.3,
    numReviews: 89
  },
  {
    title: "Leather Crossbody Bag",
    description: "Stylish genuine leather crossbody bag with multiple compartments. Perfect for daily use and travel.",
    price: 2499,
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=800&fit=crop"
    ],
    category: "accessories",
    brand: "LeatherCraft",
    stock: 25,
    rating: 4.6,
    numReviews: 67
  },
  {
    title: "Gaming Mechanical Keyboard",
    description: "RGB backlit mechanical gaming keyboard with Cherry MX switches. Perfect for gamers and typists.",
    price: 4499,
    images: [
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=800&fit=crop"
    ],
    category: "electronics",
    brand: "GamePro",
    stock: 40,
    rating: 4.7,
    numReviews: 203
  },
  {
    title: "Ceramic Coffee Mug Set",
    description: "Set of 4 premium ceramic coffee mugs. Dishwasher safe and microwave friendly. Perfect for your morning coffee.",
    price: 799,
    images: [
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&h=800&fit=crop"
    ],
    category: "home",
    brand: "HomeEssentials",
    stock: 60,
    rating: 4.4,
    numReviews: 145
  },
  {
    title: "Running Sports Shoes",
    description: "Lightweight running shoes with cushioned sole and breathable mesh upper. Ideal for jogging and gym workouts.",
    price: 3999,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1544966503-7cc0ac882dff?w=800&h=800&fit=crop"
    ],
    category: "clothing",
    brand: "SportMax",
    stock: 45,
    rating: 4.6,
    numReviews: 178
  },
  {
    title: "Wireless Charging Pad",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator.",
    price: 1499,
    images: [
      "https://images.unsplash.com/photo-1601972602237-8c79241d2c47?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&h=800&fit=crop"
    ],
    category: "electronics",
    brand: "ChargeTech",
    stock: 80,
    rating: 4.5,
    numReviews: 92
  },
  {
    title: "Designer Sunglasses",
    description: "UV protection sunglasses with polarized lenses. Stylish frame design perfect for sunny days.",
    price: 1999,
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop"
    ],
    category: "accessories",
    brand: "SunStyle",
    stock: 35,
    rating: 4.4,
    numReviews: 112
  },
  {
    title: "Modern Desk Lamp",
    description: "LED desk lamp with adjustable brightness and color temperature. Perfect for reading and working.",
    price: 1299,
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=800&fit=crop"
    ],
    category: "home",
    brand: "LightHome",
    stock: 55,
    rating: 4.5,
    numReviews: 134
  },
  {
    title: "Waterproof Smartphone Case",
    description: "Rugged waterproof case with shock absorption technology. Protects your phone from drops and water damage.",
    price: 899,
    images: [
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1601972602237-8c79241d2c47?w=800&h=800&fit=crop"
    ],
    category: "accessories",
    brand: "ProtectPro",
    stock: 90,
    rating: 4.3,
    numReviews: 201
  },
  {
    title: "Cotton Bedding Set",
    description: "Premium 100% cotton bedding set including duvet cover and pillowcases. Soft and breathable for comfortable sleep.",
    price: 3499,
    images: [
      "https://images.unsplash.com/photo-1556912172-45b7dfc0b4e0?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop"
    ],
    category: "home",
    brand: "ComfortHome",
    stock: 20,
    rating: 4.7,
    numReviews: 167
  }
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const seedProducts = async () => {
  try {
    await connectDB();

    // Clear existing products (optional - remove if you want to keep existing)
    // await Product.deleteMany({});
    // console.log('🗑️  Cleared existing products');

    // Check if products already exist
    const existingCount = await Product.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  Found ${existingCount} existing products. Skipping seed.`);
      console.log('💡 To reseed, delete products first or modify this script.');
      process.exit(0);
    }

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Successfully seeded ${products.length} products with images!`);
    console.log('\n📦 Seeded Products:');
    products.forEach((p, i) => {
      console.log(`${i + 1}. ${p.title} - ₹${p.price} - ${p.images.length} image(s)`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();

