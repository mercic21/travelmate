// bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.post('/', protect, bookingController.createBooking);
router.get('/', protect, bookingController.getUserBookings);
router.get('/:id', protect, bookingController.getBookingById);

module.exports = router;