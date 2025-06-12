import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleActionClick = (path) => {
    if (!user) {
      toast.error('Please login to continue');
      navigate('/auth', { 
        state: { from: { pathname: path } }
      });
      return;
    }
    navigate(path);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Your Ultimate</span>
          <span className="block text-indigo-600">Travel Companion</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Find and book the best hotels and events worldwide. Start your journey with us today.
        </p>
        <div className="mt-10 flex justify-center gap-6">
          {user ? (
            <>
              <Link
                to="/hotels"
                className="px-8 py-3 text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Find Hotels
              </Link>
              <Link
                to="/events"
                className="px-8 py-3 text-base font-medium rounded-md text-indigo-600 bg-white border border-indigo-600 hover:bg-indigo-50"
              >
                Discover Events
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={() => handleActionClick('/hotels')}
                className="px-8 py-3 text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Find Hotels
              </button>
              <button
                onClick={() => handleActionClick('/events')}
                className="px-8 py-3 text-base font-medium rounded-md text-indigo-600 bg-white border border-indigo-600 hover:bg-indigo-50"
              >
                Discover Events
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Feature 1 */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="text-indigo-600 mb-4">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Best Hotels</h3>
          <p className="text-gray-600">Find and book accommodations worldwide with our curated selection of hotels.</p>
        </div>

        {/* Feature 2 */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="text-indigo-600 mb-4">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Amazing Events</h3>
          <p className="text-gray-600">Discover and book tickets to the most exciting events in your area.</p>
        </div>

        {/* Feature 3 */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="text-indigo-600 mb-4">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
          <p className="text-gray-600">Book with confidence using our secure payment system.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
