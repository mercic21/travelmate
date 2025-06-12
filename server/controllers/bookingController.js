// bookingController.js
const Booking = require('../models/Booking');
const asyncHandler = require('express-async-handler');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const {
    itemType,
    itemId,
    itemDetails,
    checkInDate,
    checkOutDate,
    eventDate,
    flightDate,
    guests,
    tickets,
    passengers,
    totalAmount,
  } = req.body;

  const booking = await Booking.create({
    user: req.user._id,
    itemType,
    itemId,
    itemDetails,
    bookingDate: new Date(),
    checkInDate,
    checkOutDate,
    eventDate,
    flightDate,
    guests,
    tickets,
    passengers,
    totalAmount,
  });

  // Add booking to user's bookings array
  req.user.bookings.push(booking._id);
  await req.user.save();

  res.status(201).json(booking);
});

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
const getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('payment')
    .sort('-createdAt');
  res.json(bookings);
});

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('payment');

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Check if the booking belongs to the user or if the user is admin
  if (booking.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized to view this booking');
  }

  res.json(booking);
});

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
};