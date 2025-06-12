const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');

const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate('user', 'name email')
    .populate('item');
  res.json(bookings);
});

const createListing = asyncHandler(async (req, res) => {
  const { type, name, location, price, description, image } = req.body;

  const listing = await Listing.create({
    type,
    name,
    location,
    price,
    description,
    image
  });

  res.status(201).json(listing);
});

module.exports = {
  getAllBookings,
  createListing
};