// hotelRoutes.js
const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const { protect } = require('../middleware/auth');

router.get('/search', protect, hotelController.searchHotels);

module.exports = router;