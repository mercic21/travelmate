// eventController.js
const asyncHandler = require('express-async-handler');
const { getEvents } = require('../services/ticketmasterService');

const searchEvents = asyncHandler(async (req, res) => {
  const { city, startDate, endDate } = req.query;

  // Validate input parameters
  if (!city || !startDate || !endDate) {
    console.log('Missing parameters in request:', req.query);
    return res.status(400).json({
      success: false,
      error: 'Please provide city, start date, and end date'
    });
  }

  try {
    console.log('Searching events with params:', { city, startDate, endDate });
    const events = await getEvents(city, startDate, endDate);
    
    console.log(`Found ${events.length} events`);
    res.json(events);
  } catch (error) {
    console.error('Event search error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = {
  searchEvents
};