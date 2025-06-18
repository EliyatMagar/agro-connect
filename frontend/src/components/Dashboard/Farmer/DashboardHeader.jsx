import React, { useState, useEffect } from 'react';
import { 
  FaBars, FaSearch, FaBell, FaEnvelope, 
  FaUserCog, FaSignOutAlt, FaLeaf, FaTractor,
  FaSun, FaCloudRain
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = ({ toggleSidebar }) => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [weather, setWeather] = useState({ temp: '24°C', condition: 'Sunny' });
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    
    // Simulate farmer-specific notifications
    const mockNotifications = [
      { id: 1, message: 'New order for your wheat', read: false, time: '15 mins ago' },
      { id: 2, message: 'Irrigation scheduled tomorrow', read: true, time: '3 hours ago' },
      { id: 3, message: 'Market prices updated', read: false, time: '1 day ago' },
      { id: 4, message: 'Soil test results ready', read: false, time: '2 days ago' }
    ];
    setNotifications(mockNotifications);

    // Simulate weather data fetch
    const weatherConditions = [
      { temp: '22°C', condition: 'Partly Cloudy', icon: <FaSun className="text-yellow-400" /> },
      { temp: '24°C', condition: 'Sunny', icon: <FaSun className="text-yellow-500" /> },
      { temp: '19°C', condition: 'Rainy', icon: <FaCloudRain className="text-blue-400" /> }
    ];
    setWeather(weatherConditions[Math.floor(Math.random() * weatherConditions.length)]);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/farm-search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/farmer-login');
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-green-700 text-white shadow-md sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Menu button and weather */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleSidebar} 
            className="p-2 rounded-full hover:bg-green-600 mr-2"
            aria-label="Toggle sidebar"
          >
            <FaBars className="text-xl" />
          </button>
          
          {/* Weather display */}
          <div className="hidden md:flex items-center space-x-2 bg-green-600 px-3 py-1 rounded-lg">
            {weather.icon || <FaSun className="text-yellow-400" />}
            <span className="text-sm">
              {weather.temp} | {weather.condition}
            </span>
          </div>
          
          {/* Search bar */}
          <form onSubmit={handleSearch} className="hidden md:block relative ml-4">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-200" />
            <input
              type="text"
              placeholder="Search crops, orders, tools..."
              className="pl-10 pr-4 py-2 w-64 bg-green-600 text-white placeholder-green-200 border border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Right side - User controls */}
        <div className="flex items-center space-x-4">
          {/* Notification and Messages */}
          <button className="p-2 relative rounded-full hover:bg-green-600">
            <FaBell className="text-xl" />
            {unreadNotifications > 0 && (
              <span className="absolute top-0 right-0 bg-yellow-500 text-green-800 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </button>
          
          {/* User dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="w-9 h-9 rounded-full bg-yellow-400 text-green-800 flex items-center justify-center">
                {user?.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="font-bold">
                    {user?.name?.charAt(0).toUpperCase() || 'F'}
                  </span>
                )}
              </div>
              <span className="hidden md:inline text-sm font-medium">
                {user?.name || 'Farmer'}
              </span>
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-green-200">
                <div className="px-4 py-2 text-sm text-green-800 border-b border-green-100">
                  <div className="font-medium">{user?.name || 'Farmer'}</div>
                  <div className="text-xs text-green-600">{user?.farmName || 'Family Farm'}</div>
                </div>
                <Link
                  to="/farmer/account"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
                >
                  <FaUserCog className="inline mr-2 text-green-600" /> My Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
                >
                  <FaSignOutAlt className="inline mr-2 text-green-600" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search - shows only on small screens */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-200" />
          <input
            type="text"
            placeholder="Search farm items..."
            className="pl-10 pr-4 py-2 w-full bg-green-600 text-white placeholder-green-200 border border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
    </header>
  );
};

export default DashboardHeader;