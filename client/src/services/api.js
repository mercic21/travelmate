import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: "https://travelmate-58h3.onrender.com",
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.message || 
                        error.message || 
                        'An unexpected error occurred';
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    
    return Promise.reject(new Error(errorMessage));
  }
);

export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      const data = response.data;
      
      // Transform the response to match expected structure
      return {
        user: {
          id: data._id,
          name: data.name,
          email: data.email,
          isAdmin: data.isAdmin
        },
        token: data.token
      };
    } catch (error) {
      console.error('Login request failed:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      console.log('Register response:', response);
      return {
        token: response.token,
        user: response.user || { ...response, token: undefined }
      };
    } catch (error) {
      console.error('Register error details:', error);
      throw error;
    }
  },
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.user || response;
    } catch (error) {
      throw error;
    }
  }
};

export const hotelsAPI = {
  search: async (params) => {
    try {
      console.log('Searching hotels with params:', params);
      
      try {
        // Try real API first
        const response = await api.get('/hotels/search', {
          params: {
            location: params.location.trim(),
            checkIn: params.checkIn,
            checkOut: params.checkOut,
            guests: params.guests || 1
          }
        });
        
        if (response.data && response.data.length > 0) {
          return response;
        }
        
        // If no results, try dummy listings
        throw new Error('No results from main API');
        
      } catch (error) {
        console.log('Falling back to dummy listings');
        const dummyResponse = await api.get('/dummy-listings', {
          params: {
            type: 'hotel',
            location: params.location
          }
        });

        return {
          success: true,
          data: dummyResponse.map(listing => ({
            id: listing._id,
            name: listing.name,
            location: listing.location,
            price: listing.price,
            image: listing.image,
            description: listing.description || 'A comfortable stay awaits you',
            isDummy: true
          }))
        };
      }
    } catch (error) {
      console.error('Hotel search error:', error);
      throw error;
    }
  }
};

export const eventsAPI = {
  search: async (params) => {
    try {
      // Validate parameters before making the request
      if (!params.city || !params.startDate || !params.endDate) {
        throw new Error('Please provide city, start date, and end date');
      }

      console.log('Searching events with params:', params);
      const response = await api.get('/events/search', {
        params: {
          city: params.city.trim(),
          startDate: params.startDate,
          endDate: params.endDate
        }
      });

      // If response is empty array, that's ok - return it
      if (Array.isArray(response)) {
        return response;
      }

      // If response has _embedded.events structure, return events array
      if (response._embedded?.events) {
        return response._embedded.events;
      }

      // Otherwise return empty array
      return [];
    } catch (error) {
      console.error('Events search error:', error);
      throw error;
    }
  }
};

export const bookingsAPI = {
  create: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response;
    } catch (error) {
      throw error;
    }
  },
  confirm: async (bookingId, paymentIntentId) => {
    try {
      const response = await api.post(`/payments/confirm`, {
        bookingId,
        paymentIntentId
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export const paymentsAPI = {
  createIntent: async ({ amount, itemType, itemId }) => {
    try {
      console.log('Creating payment intent:', { amount, itemType, itemId });
      const response = await api.post('/payments/create-intent', {
        amount,
        itemType,
        itemId
      });
      
      if (!response.clientSecret || !response.bookingId) {
        throw new Error('Invalid payment intent response');
      }
      
      return {
        clientSecret: response.clientSecret,
        bookingId: response.bookingId
      };
    } catch (error) {
      console.error('Payment intent creation failed:', error);
      throw new Error(error.message || 'Failed to create payment');
    }
  }
};

export const adminAPI = {
  getAllBookings: async () => {
    try {
      const response = await api.get('/admin/bookings');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  createListing: async (listingData) => {
    try {
      const response = await api.post('/admin/listings', listingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default api;
