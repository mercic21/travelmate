const axios = require('axios');

const getEvents = async (city, startDate, endDate) => {
  try {
    // Validate parameters
    if (!city || !startDate || !endDate) {
      console.log('Missing required parameters:', { city, startDate, endDate });
      throw new Error('Missing required parameters');
    }

    // Format dates and encode parameters
    const formattedStartDate = new Date(startDate).toISOString().split('.')[0] + 'Z';
    const formattedEndDate = new Date(endDate).toISOString().split('.')[0] + 'Z';
    const encodedCity = encodeURIComponent(city);

    const url = `https://app.ticketmaster.com/discovery/v2/events.json`;
    const params = {
      apikey: process.env.TICKETMASTER_API_KEY,
      city: encodedCity,
      startDateTime: formattedStartDate,
      endDateTime: formattedEndDate,
      size: 200,
      sort: 'date,asc'
    };

    console.log('Ticketmaster API request params:', params);

    const response = await axios.get(url, { params });
    
    console.log('Ticketmaster API response status:', response.status);
    console.log('Events found:', response.data?._embedded?.events?.length || 0);

    return response.data._embedded?.events || [];
  } catch (error) {
    console.error('Ticketmaster API error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw new Error(`Failed to fetch events: ${error.message}`);
  }
};

module.exports = {
  getEvents,
};