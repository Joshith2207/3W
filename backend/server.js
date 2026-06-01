const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const seedDatabase = require('./seeder');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic welcome route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Mini Social Post API!' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));

// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ Error: MONGO_URI is not defined in .env file!');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('🔌 Connected to MongoDB Atlas cluster successfully.');
    // Trigger auto-seeder
    await seedDatabase();
    
    // Start Server
    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });
