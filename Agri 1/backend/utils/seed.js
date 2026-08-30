// Run with: npm run seed
// Creates a demo admin, farmer, buyer, a couple of crops, and store products.
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Crop = require('../models/Crop');
const Product = require('../models/Product');

const run = async () => {
  await connectDB();

  await Promise.all([User.deleteMany(), Crop.deleteMany(), Product.deleteMany()]);

  const admin = await User.create({
    name: 'Admin',
    email: 'admin@smartagri.com',
    phone: '9999999999',
    password: 'admin123',
    role: 'admin',
    isVerified: true
  });

  const farmer = await User.create({
    name: 'Ramesh Patil',
    email: 'farmer@smartagri.com',
    phone: '9876543210',
    password: 'farmer123',
    role: 'farmer',
    location: { village: 'Shirur', district: 'Pune', state: 'Maharashtra', pincode: '412210' },
    farmDetails: { farmSize: 5, soilType: 'Black soil', irrigationType: 'Drip', primaryCrops: ['Wheat', 'Sugarcane'] },
    isVerified: true
  });

  const buyer = await User.create({
    name: 'Suresh Traders',
    email: 'buyer@smartagri.com',
    phone: '9123456789',
    password: 'buyer123',
    role: 'buyer',
    buyerType: 'trader',
    companyName: 'Suresh Agro Traders Pvt Ltd',
    location: { village: '', district: 'Pune', state: 'Maharashtra', pincode: '411001' },
    isVerified: true
  });

  await Crop.create([
    {
      farmer: farmer._id,
      cropName: 'Wheat',
      category: 'grain',
      quantity: 50,
      expectedPrice: 2200,
      harvestDate: new Date('2026-03-15'),
      description: 'High quality wheat, freshly harvested.',
      quality: 'A-grade',
      location: farmer.location,
      status: 'active'
    },
    {
      farmer: farmer._id,
      cropName: 'Sugarcane',
      category: 'cash-crop',
      quantity: 200,
      expectedPrice: 350,
      harvestDate: new Date('2026-01-20'),
      description: 'Good quality sugarcane ready for crushing.',
      quality: 'A-grade',
      location: farmer.location,
      status: 'active'
    }
  ]);

  await Product.create([
    {
      name: 'Hybrid Wheat Seeds (HD-2967)',
      category: 'seed',
      brand: 'AgriGold',
      description: 'High-yield hybrid wheat seed variety.',
      price: 850,
      unit: '40kg bag',
      stock: 100,
      createdBy: admin._id
    },
    {
      name: 'NPK 19:19:19 Fertilizer',
      category: 'fertilizer',
      brand: 'IFFCO',
      description: 'Balanced water-soluble fertilizer for all crops.',
      price: 1200,
      unit: '50kg bag',
      stock: 60,
      createdBy: admin._id
    },
    {
      name: 'Neem Oil Pesticide',
      category: 'pesticide',
      brand: 'Bio Green',
      description: 'Organic pest control solution, safe for all crops.',
      price: 450,
      unit: '1 litre',
      stock: 150,
      createdBy: admin._id
    },
    {
      name: 'Manual Seed Drill',
      category: 'tool',
      brand: 'FarmTech',
      description: 'Hand-operated seed drill for precise sowing.',
      price: 3200,
      unit: 'piece',
      stock: 20,
      createdBy: admin._id
    }
  ]);

  console.log('Seed data created!');
  console.log('Admin login:  admin@smartagri.com / admin123');
  console.log('Farmer login: farmer@smartagri.com / farmer123');
  console.log('Buyer login:  buyer@smartagri.com / buyer123');

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
