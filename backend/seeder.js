import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import products from './data/products.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // Clear all existing documents
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Create an admin and a regular user (User.create runs save middleware password hashing)
    const adminUserDoc = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: '123456',
      isAdmin: true,
    });

    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      isAdmin: false,
    });

    const adminUser = adminUserDoc._id;

    // Attach user reference or admin identifier to products (if desired)
    const sampleProducts = products.map((product) => {
      return { ...product };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error with data destruction: ${error}`);
    process.exit(1);
  }
};

// Check argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
