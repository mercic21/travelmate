const dotenv = require('dotenv');
dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount, itemType, itemId } = req.body;

  try {
    console.log('Creating payment intent:', { amount, itemType, itemId });

    if (!amount || !itemType || !itemId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required payment details'
      });
    }

    // Create a booking first
    const booking = await Booking.create({
      user: req.user._id,
      itemType,
      itemId,
      totalAmount: amount,
      paymentStatus: 'pending'
    });

    console.log('Created booking:', booking._id);

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        bookingId: booking._id.toString(),
        itemType,
        itemId
      }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      bookingId: booking._id
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const confirmPayment = asyncHandler(async (req, res) => {
  const { paymentIntentId, bookingId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (!paymentIntent) {
      res.status(404);
      throw new Error('Payment intent not found');
    }

    if (paymentIntent.status !== 'succeeded') {
      res.status(400);
      throw new Error('Payment not succeeded');
    }

    const booking = await Booking.findOne({ _id: bookingId });
    if (!booking) {
      res.status(404);
      throw new Error(`Booking ${bookingId} not found`);
    }

    // ...rest of your confirmPayment logic...
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = {
  createPaymentIntent,
  confirmPayment
};