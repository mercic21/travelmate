const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getAllBookings, createListing } = require('../controllers/adminController');

router.use(protect, adminOnly);
router.get('/bookings', getAllBookings);
router.post('/listings', createListing);

module.exports = router;