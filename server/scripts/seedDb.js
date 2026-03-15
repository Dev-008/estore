import 'dotenv/config';
import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Product from '../models/productModel.js';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load products from JSON file
const productsPath = join(__dirname, 'products.json');
const sampleProducts = JSON.parse(readFileSync(productsPath, 'utf-8'));

const seedDatabase = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');

    console.log('🗑️  Clearing existing products...');
    await Product.deleteMany({});
    console.log('✅ Products cleared');

    console.log('📝 Seeding database with sample products...');
    const result = await Product.insertMany(sampleProducts);
    console.log(`✅ Successfully inserted ${result.length} products`);

    console.log('\n✨ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
