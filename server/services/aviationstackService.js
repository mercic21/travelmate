const axios = require('axios');

const getFlights = async (departureIata, arrivalIata, date) => {
  try {
    const response = await axios.get(
      `http://api.aviationstack.com/v1/flights?access_key=${process.env.AVIATIONSTACK_API_KEY}&dep_iata=${departureIata}&arr_iata=${arrivalIata}&flight_date=${date}`
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching flights:', error.response?.data || error.message);
    throw new Error('Failed to fetch flight data');
  }
};

module.exports = {
  getFlights,
};