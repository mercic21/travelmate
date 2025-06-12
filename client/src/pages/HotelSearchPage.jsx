import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { hotelsAPI } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PaymentModal from '../components/payment/PaymentModal';
import toast from 'react-hot-toast';
import VoiceSearchButton from '../components/voice/VoiceSearchButton';
import LanguageSelector from '../components/voice/LanguageSelector';
import voiceService from '../services/voiceService';

const HotelSearchPage = () => {
  const [searchParams, setSearchParams] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });

  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['hotels', searchParams],
    queryFn: () => hotelsAPI.search(searchParams),
    enabled: false,
    retry: 1
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchParams.location || !searchParams.checkIn || !searchParams.checkOut) {
      return;
    }
    refetch();
  };

  const handleBooking = (hotel) => {
    // Calculate total nights
    const checkIn = new Date(searchParams.checkIn);
    const checkOut = new Date(searchParams.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    // Set selected hotel with additional booking details
    setSelectedHotel({
      ...hotel,
      bookingDetails: {
        nights,
        guests: searchParams.guests,
        checkIn: searchParams.checkIn,
        checkOut: searchParams.checkOut,
        totalAmount: hotel.price * nights * searchParams.guests
      }
    });
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setSelectedHotel(null);
    toast.success('Hotel booked successfully!');
  };

  const handleVoiceInput = (transcript) => {
    setSearchParams(prev => ({ ...prev, location: transcript }));
    // Read back the recognized location
    voiceService.speak(`Searching for hotels in ${transcript}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Find Hotels</h1>
        <LanguageSelector />
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Destination
            </label>
            <div className="flex gap-2">
              <input
                id="location"
                type="text"
                placeholder="e.g., LON, PAR, NYC"
                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchParams.location}
                onChange={(e) => setSearchParams(prev => ({ ...prev, location: e.target.value }))}
                required
              />
              <VoiceSearchButton onResult={handleVoiceInput} />
            </div>
            <p className="text-xs text-gray-500">Enter city or destination name</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700">
              Check-in Date
            </label>
            <input
              id="checkIn"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchParams.checkIn}
              onChange={(e) => setSearchParams(prev => ({ ...prev, checkIn: e.target.value }))}
              required
            />
            <p className="text-xs text-gray-500">Select your arrival date</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700">
              Check-out Date
            </label>
            <input
              id="checkOut"
              type="date"
              min={searchParams.checkIn || new Date().toISOString().split('T')[0]}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchParams.checkOut}
              onChange={(e) => setSearchParams(prev => ({ ...prev, checkOut: e.target.value }))}
              required
            />
            <p className="text-xs text-gray-500">Select your departure date</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="guests" className="block text-sm font-medium text-gray-700">
              Number of Guests
            </label>
            <input
              id="guests"
              type="number"
              min="1"
              max="10"
              placeholder="1"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchParams.guests}
              onChange={(e) => setSearchParams(prev => ({ ...prev, guests: parseInt(e.target.value) || 1 }))}
              required
            />
            <p className="text-xs text-gray-500">Maximum 10 guests per booking</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Search Hotels
          </button>
        </div>
      </form>

      {isLoading && <LoadingSpinner />}
      
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded">
          {error.message || 'Failed to fetch hotels'}
        </div>
      )}

      {data ? (
        data.data && data.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.data.map((hotel) => (
              <div key={hotel.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {hotel.image && (
                  <img 
                    src={hotel.image} 
                    alt={hotel.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
                  <p className="text-gray-600 mb-4">{hotel.location}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">
                      ${hotel.price} <span className="text-sm text-gray-500">per night</span>
                    </span>
                    <button
                      onClick={() => handleBooking(hotel)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">
            <p>No hotels found for the selected criteria</p>
            <p className="text-sm text-gray-500 mt-2">
              Try adjusting your dates or choosing a different location
            </p>
          </div>
        )
      ) : null}

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={selectedHotel?.bookingDetails?.totalAmount || 0}
        itemType="hotel"
        itemId={selectedHotel?.id}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default HotelSearchPage;
