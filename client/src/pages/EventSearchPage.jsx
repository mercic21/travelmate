import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { eventsAPI } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PaymentModal from '../components/payment/PaymentModal';
import VoiceSearchButton from '../components/voice/VoiceSearchButton';
import LanguageSelector from '../components/voice/LanguageSelector';
import voiceService from '../services/voiceService';
import toast from 'react-hot-toast';

const EventSearchPage = () => {
  const [searchParams, setSearchParams] = useState({
    city: '',
    startDate: '',
    endDate: ''
  });

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['events', searchParams],
    queryFn: () => eventsAPI.search(searchParams),
    enabled: false,
    retry: 1,
    onError: (error) => {
      console.error('Event search error:', error);
    }
  });

  // Add these debug logs
  console.log('Raw response data:', data);
  console.log('Events array:', data?._embedded?.events);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all required fields
    if (!searchParams.city?.trim()) {
      toast.error('Please enter a city name');
      return;
    }
    if (!searchParams.startDate) {
      toast.error('Please select a start date');
      return;
    }
    if (!searchParams.endDate) {
      toast.error('Please select an end date');
      return;
    }

    // Validate date range
    const start = new Date(searchParams.startDate);
    const end = new Date(searchParams.endDate);
    if (end < start) {
      toast.error('End date must be after start date');
      return;
    }

    console.log('Submitting search with params:', searchParams);
    refetch();
  };

  const handleBooking = (event) => {
    setSelectedEvent(event);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setSelectedEvent(null);
    toast.success('Event booked successfully!');
  };

  const handleVoiceInput = (transcript) => {
    setSearchParams(prev => ({ ...prev, city: transcript }));
    // Read back the recognized city
    voiceService.speak(`Searching for events in ${transcript}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Find Events</h1>
        <LanguageSelector />
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  id="city"
                  type="text"
                  placeholder="e.g., London, Paris, New York"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchParams.city}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, city: e.target.value }))}
                  required
                />
              </div>
              <VoiceSearchButton 
                onResult={(text) => {
                  setSearchParams(prev => ({ ...prev, city: text }));
                  voiceService.speak(`Searching for events in ${text}`);
                }}
                placeholder="Speak city name"
              />
            </div>
            <p className="text-xs text-gray-500">Enter or speak the city name</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchParams.startDate}
              onChange={(e) => setSearchParams(prev => ({ ...prev, startDate: e.target.value }))}
              required
            />
            <p className="text-xs text-gray-500">Select the earliest date</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              min={searchParams.startDate || new Date().toISOString().split('T')[0]}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchParams.endDate}
              onChange={(e) => setSearchParams(prev => ({ ...prev, endDate: e.target.value }))}
              required
            />
            <p className="text-xs text-gray-500">Select the latest date</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Search Events
          </button>
        </div>
      </form>

      {/* Results section */}
      {isLoading && <LoadingSpinner />}
      
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-md">
          {error.message || 'Failed to fetch events'}
        </div>
      )}

      {data ? (
        Array.isArray(data) && data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {event.images?.[0]?.url && (
                  <img 
                    src={event.images[0].url} 
                    alt={event.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
                  <p className="text-gray-600 mb-4">
                    {event._embedded?.venues?.[0]?.name || 'Venue TBA'}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {event.dates?.start?.dateTime && 
                        new Date(event.dates.start.dateTime).toLocaleDateString()
                      }
                    </span>
                    <button
                      onClick={() => handleBooking(event)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      Book Tickets
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">
            <p>No events found for the selected criteria</p>
            <p className="text-sm text-gray-500 mt-2">
              Try adjusting your search parameters or selecting a different date range
            </p>
          </div>
        )
      ) : null}

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={selectedEvent?.priceRanges?.[0]?.min || 50} // Default price if not available
        itemType="event"
        itemId={selectedEvent?.id}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default EventSearchPage;
