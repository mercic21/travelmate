const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const errorHandler = require('./utils/errorHandler');
const paymentRoutes = require('./routes/paymentRoutes');


dotenv.config();

console.log('Stripe key available:', !!process.env.STRIPE_SECRET_KEY);
console.log('Stripe key length:', process.env.STRIPE_SECRET_KEY?.length);


const requiredEnvVars = ['MONGO_URI', 'STRIPE_SECRET_KEY'];
const missingEnvVars = requiredEnvVars.filter(key => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '));
  process.exit(1);
}


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => console.error('MongoDB connection error:', err));

const app = express();

// CORS configuration
app.use(cors({
  credentials: true,
  origin: 'https://travelmate-delta.vercel.app', 
  
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());


if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/hotels', require('./routes/hotelRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/payments', paymentRoutes);
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});


process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  
  process.exit(1);
});

module.exports = app;