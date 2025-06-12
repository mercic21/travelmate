import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [newListing, setNewListing] = useState({
    type: 'hotel',
    name: '',
    location: '',
    price: '',
    image: 'https://source.unsplash.com/800x600/?hotel'
  });

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: adminAPI.getAllBookings
  });

  const handleAddListing = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createListing(newListing);
      toast.success('Dummy listing added successfully');
      setNewListing({
        type: 'hotel',
        name: '',
        location: '',
        price: '',
        image: 'https://source.unsplash.com/800x600/?hotel'
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="mb-6 flex space-x-4">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'bookings' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          View All Bookings
        </button>
        <button
          onClick={() => setActiveTab('add-listing')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'add-listing' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Add Dummy Listing
        </button>
      </div>

      {activeTab === 'bookings' ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <LoadingSpinner />
          ) : !bookings?.length ? (
            <p className="p-4 text-gray-500">No bookings found</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="px-6 py-4">{booking.user?.email}</td>
                    <td className="px-6 py-4">{booking.itemType}</td>
                    <td className="px-6 py-4">${booking.totalAmount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        booking.paymentStatus === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <form onSubmit={handleAddListing} className="bg-white rounded-lg shadow p-6 max-w-md">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={newListing.type}
                onChange={(e) => setNewListing(prev => ({ ...prev, type: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="hotel">Hotel</option>
                <option value="event">Event</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={newListing.name}
                onChange={(e) => setNewListing(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={newListing.location}
                onChange={(e) => setNewListing(prev => ({ ...prev, location: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                value={newListing.price}
                onChange={(e) => setNewListing(prev => ({ ...prev, price: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Dummy Listing
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminDashboard;
