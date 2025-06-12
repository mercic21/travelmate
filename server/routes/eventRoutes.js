// eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { protect } = require('../middleware/auth');

router.get('/search', protect, eventController.searchEvents);

module.exports = router;