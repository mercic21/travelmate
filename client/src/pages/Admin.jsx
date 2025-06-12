import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import ListingForm from '../components/admin/ListingForm';
import BookingsList from '../components/admin/BookingsList';

const AdminDashboard = () => (
  <div className="grid grid-cols-1 gap-6">
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
      
    </div>
  </div>
);

const ManageListings = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Add New Listing</h2>
    <ListingForm onSubmit={(data) => console.log('New listing:', data)} />
  </div>
);

const ViewBookings = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6">All Bookings</h2>
    <BookingsList />
  </div>
);

const Admin = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="listings" element={<ManageListings />} />
        <Route path="bookings" element={<ViewBookings />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default Admin;
