const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Sensor = require('../models/Sensor');
const connectDB = require('../config/db');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@smartcity.com' });
    if (!adminExists) {
      const admin = new User({
        email: 'admin@smartcity.com',
        password: 'admin123',
        role: 'admin',
        name: 'Admin User'
      });
      await admin.save();
      console.log('Admin user created');
    }

    // Create sample sensors
    const sensors = [
      { name: 'Air Sensor 1', type: 'air', location: { lat: 22.3072, lon: 73.1812 }, value: 72, unit: 'AQI' },
      { name: 'Traffic Sensor 1', type: 'traffic', location: { lat: 22.3172, lon: 73.1912 }, value: 35, unit: '%' },
      { name: 'Energy Sensor 1', type: 'energy', location: { lat: 22.2972, lon: 73.1712 }, value: 56, unit: '%' },
      { name: 'Water Sensor 1', type: 'water', location: { lat: 22.3272, lon: 73.2012 }, value: 85, unit: '%' },
      { name: 'Noise Sensor 1', type: 'noise', location: { lat: 22.2872, lon: 73.1612 }, value: 45, unit: 'dB' }
    ];

    for (const sensorData of sensors) {
      const exists = await Sensor.findOne({ name: sensorData.name });
      if (!exists) {
        const sensor = new Sensor(sensorData);
        await sensor.save();
        console.log(`Sensor ${sensorData.name} created`);
      }
    }

    console.log('Seeding completed');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();
