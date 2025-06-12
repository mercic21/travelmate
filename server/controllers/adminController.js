const Booking = require('../models/Booking');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');


const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({})
    .populate('user', 'name email')
    .populate('payment')
    .sort('-createdAt');
  res.json(bookings);
});


const createDummyHotel = asyncHandler(async (req, res) => {
  const { name, city, price, description, image } = req.body;

 
  const dummyHotel = {
    id: `dummy_${Date.now()}`,
    name,
    city,
    price,
    description,
    image,
    type: 'dummy',
  };

  res.status(201).json(dummyHotel);
});


const createDummyEvent = asyncHandler(async (req, res) => {
  const { name, city, date, price, description, image } = req.body;


  const dummyEvent = {
    id: `dummy_${Date.now()}`,
    name,
    city,
    date,
    price,
    description,
    image,
    type: 'dummy',
  };

  res.status(201).json(dummyEvent);
});

module.exports = {
  getAllBookings,
  createDummyHotel,
  createDummyEvent,
};