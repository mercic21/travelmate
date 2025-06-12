import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const isAuthPage = location.pathname === '/auth';

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center text-xl font-bold text-indigo-600">
              TravelMate
            </Link>
            
            {user && (
              <div className="hidden md:flex md:items-center md:ml-10 space-x-4">
                <Link to="/hotels" className="text-gray-700 hover:text-indigo-600 px-3 py-2">
                  Hotels
                </Link>
                <Link to="/events" className="text-gray-700 hover:text-indigo-600 px-3 py-2">
                  Events
                </Link>
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {user.name}</span>
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2"
                >
                  Logout
                </button>
              </div>
            ) : !isAuthPage && (
              <Link to="/auth" className="text-gray-700 hover:text-indigo-600 px-3 py-2">
                Login
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user ? (
              <>
                <Link to="/hotels" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">
                  Hotels
                </Link>
                <Link to="/events" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">
                  Events
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-indigo-600"
                >
                  Logout
                </button>
              </>
            ) : !isAuthPage && (
              <Link to="/auth" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
