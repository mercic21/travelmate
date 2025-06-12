const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemType: {
    type: String,
    required: true,
    enum: ['hotel', 'event']
  },
  itemId: {
    type: String,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  bookingDetails: {
    checkIn: Date,
    checkOut: Date,
    guests: Number,
    nights: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);