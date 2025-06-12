const asyncHandler = require('express-async-handler');
const amadeusService = require('../services/amadeusService');

const searchHotels = asyncHandler(async (req, res) => {
  const { location, checkIn, checkOut, guests } = req.query;

  try {
    if (!location || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters'
      });
    }

    const today = new Date();
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const duration = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);

    if (duration > 30) {
      return res.status(400).json({
        success: false,
        error: 'Maximum stay duration is 30 days'
      });
    }

    if (checkInDate < today) {
      return res.status(400).json({
        success: false,
        error: 'Check-in date must be in the future'
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        error: 'Check-out date must be after check-in date'
      });
    }

    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() + 1);
    if (checkInDate > maxDate) {
      return res.status(400).json({
        success: false,
        error: 'Cannot book more than 1 year in advance'
      });
    }

    const formattedCheckIn = checkIn.split('T')[0];
    const formattedCheckOut = checkOut.split('T')[0];

    const cityCode = location.slice(0, 3).toUpperCase();

    console.log('Searching for hotels:', {
      city: cityCode,
      checkIn: formattedCheckIn,
      checkOut: formattedCheckOut
    });

    const hotels = await amadeusService.getHotels(
      cityCode,
      formattedCheckIn,
      formattedCheckOut
    );

    return res.json({
      success: true,
      count: hotels.length,
      data: hotels
    });

  } catch (error) {
    console.error('Hotel search failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch hotels'
    });
  }
});

module.exports = { searchHotels };
