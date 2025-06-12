const Amadeus = require('amadeus');

class AmadeusService {
  constructor() {
    try {
      const clientId = process.env.AMADEUS_CLIENT_ID?.trim();
      const clientSecret = process.env.AMADEUS_CLIENT_SECRET?.trim();

      if (!clientId || !clientSecret) {
        throw new Error('Missing Amadeus credentials');
      }

      this.amadeus = new Amadeus({
        clientId,
        clientSecret
      });

      console.log('Amadeus client initialized');
    } catch (error) {
      console.error('Amadeus initialization error:', error);
      throw error;
    }
  }

  async getHotels(cityCode, checkInDate, checkOutDate) {
    try {
      console.log('Starting hotel search:', { cityCode, checkInDate, checkOutDate });

      const citySearch = await this.amadeus.referenceData.locations.hotels.byCity.get({
        cityCode: cityCode
      });

      if (!citySearch.data || citySearch.data.length === 0) {
        console.log('No hotels found in city:', cityCode);
        return [];
      }

      // Get first 10 hotels for better performance
      const hotelIds = citySearch.data
        .slice(0, 10)
        .map(hotel => hotel.hotelId);

      console.log(`Found ${hotelIds.length} hotels, getting offers...`);

      // Get offers for these hotels
      const hotelOffers = await this.amadeus.shopping.hotelOffersSearch.get({
        hotelIds: hotelIds.join(','),
        adults: 1,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        roomQuantity: 1,
        bestRateOnly: true,
        currency: 'EUR'
      });

      console.log('Hotel offers response:', {
        hasData: !!hotelOffers.data,
        count: Array.isArray(hotelOffers.data) ? hotelOffers.data.length : (hotelOffers.data ? 1 : 0)
      });

      // Return empty array if no offers
      if (!hotelOffers.data) {
        return [];
      }

      // Ensure we always have an array
      const hotels = Array.isArray(hotelOffers.data) ? hotelOffers.data : [hotelOffers.data];
      
      // Transform and filter out any invalid hotels
      const validHotels = hotels
        .filter(offer => offer?.hotel && offer?.offers?.[0]?.price)
        .map(offer => ({
          id: offer.hotel.hotelId,
          name: offer.hotel.name || 'Unknown Hotel',
          rating: offer.hotel.rating,
          location: `${offer.hotel.address?.cityName || cityCode}, ${offer.hotel.address?.countryCode || ''}`,
          price: parseFloat(offer.offers[0].price.total) || 0,
          currency: offer.offers[0].price.currency || 'EUR',
          description: offer.hotel.description?.text || 'Luxury accommodation',
          checkIn: checkInDate,
          checkOut: checkOutDate,
          image: `https://source.unsplash.com/800x600/?hotel,${encodeURIComponent(offer.hotel.name || 'luxury-hotel')}`
        }));

      console.log(`Returning ${validHotels.length} valid hotel offers`);
      return validHotels;

    } catch (error) {
      console.error('Amadeus API Error:', {
        message: error.message,
        code: error.code,
        description: error.description,
        response: error.response?.data
      });

      if (error.code === 'INVALID_CLIENT') {
        throw new Error('Invalid Amadeus API credentials');
      }

      throw new Error(error.description || error.message || 'Failed to fetch hotels');
    }
  }
}

module.exports = new AmadeusService();
