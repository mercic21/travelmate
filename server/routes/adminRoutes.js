const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// Apply middleware first
router.use(protect);
router.use(adminOnly);

// Define routes
router.get('/bookings', adminController.getAllBookings);
router.post('/listings', adminController.createListing);

module.exports = router;