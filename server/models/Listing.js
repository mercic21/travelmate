const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['hotel', 'event']
  },
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Listing', ListingSchema);
