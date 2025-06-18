import React, { useState, useEffect } from 'react';
import { FaBars, FaSearch, FaBell, FaEnvelope, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = ({ toggleSidebar }) => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    
    // Simulate fetching notifications
    const mockNotifications = [
      { id: 1, message: 'New order received', read: false, time: '2 mins ago' },
      { id: 2, message: 'Product approved', read: true, time: '1 hour ago' },
      { id: 3, message: 'System update available', read: false, time: '3 days ago' }
    ];
    setNotifications(mockNotifications);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Menu button */}
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar} 
            className="md:hidden p-2 rounded-full hover:bg-gray-100 mr-2"
            aria-label="Toggle sidebar"
          >
            <FaBars className="text-xl text-gray-600" />
          </button>
          
          {/* Search bar */}
          <form onSubmit={handleSearch} className="hidden md:block relative ml-4">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, orders..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Right side - User controls */}
        <div className="flex items-center space-x-4">
          {/* Notification and Messages */}
          <button className="p-2 relative rounded-full hover:bg-gray-100">
            <FaBell className="text-xl text-gray-600" />
            {unreadNotifications > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </button>
          
          <button className="p-2 relative rounded-full hover:bg-gray-100">
            <FaEnvelope className="text-xl text-gray-600" />
          </button>
          
          {/* User dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-700 font-medium">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <span className="hidden md:inline text-sm font-medium text-gray-700">
                {user?.name || 'User'}
              </span>
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <Link
                  to="/farmer/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FaCog className="inline mr-2" /> Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FaSignOutAlt className="inline mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search - shows only on small screens */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
    </header>
  );
};

export default DashboardHeader;