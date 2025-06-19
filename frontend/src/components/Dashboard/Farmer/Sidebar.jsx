import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, FaPlusCircle, FaBox, 
  FaChartLine, FaUserCog, FaTimes,
  FaChevronDown, FaChevronRight,
  FaLeaf, FaTractor, FaSeedling, FaWarehouse
} from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = React.useState({});

  const navItems = [
    { 
      path: '/farmer-dashboard', 
      icon: <FaHome className="text-lg" />, 
      label: 'My Farm',
      exact: true
    },
    { 
      label: 'Crops & Products',
      icon: <FaSeedling className="text-lg" />,
      subItems: [
        { 
          path: '/products/addproductsByFarmer', 
          icon: <FaPlusCircle className="text-sm" />, 
          label: 'Add New Crop' 
        },
        { 
          path: '/products/manage', 
          icon: <FaLeaf className="text-sm" />, 
          label: 'Manage Crops' 
        },
        { 
          path: '/products/inventory', 
          icon: <FaWarehouse className="text-sm" />, 
          label: 'Inventory' 
        },
      ]
    },
    { 
      path: '/farm-equipment', 
      icon: <FaTractor className="text-lg" />, 
      label: 'Equipment' 
    },
    { 
      path: '/farmer/stats', 
      icon: <FaChartLine className="text-lg" />, 
      label: 'Farm Analytics' 
    },
    { 
      path: '/farmer/settings', 
      icon: <FaUserCog className="text-lg" />, 
      label: 'My Account' 
    }
  ];

  const toggleMenu = (label) => {
    setExpandedMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const isActive = (path, exact = false) => {
    return exact 
      ? location.pathname === path
      : location.pathname.startsWith(path);
  };

  return (
    <div className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      md:relative md:translate-x-0 transition-transform duration-200 ease-in-out 
      w-64 bg-green-800 text-white z-50 md:z-0 flex flex-col shadow-lg`}>
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-green-600">
        <h1 className="text-xl font-bold flex items-center">
          <span className="bg-white text-green-700 rounded-lg p-2 mr-2">
            <FaLeaf />
          </span>
          FarmConnect
        </h1>
        <button 
          onClick={toggleSidebar} 
          className="md:hidden p-1 rounded-full hover:bg-green-700 transition-colors"
          aria-label="Toggle sidebar"
        >
          <FaTimes className="text-xl" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path || item.label}>
              {item.path ? (
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 transition-colors ${
                    isActive(item.path, item.exact) 
                      ? 'bg-green-700 font-medium border-l-4 border-yellow-400' 
                      : 'hover:bg-green-700 hover:border-l-4 hover:border-yellow-300'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </Link>
              ) : (
                <div className="cursor-pointer">
                  <div 
                    onClick={() => toggleMenu(item.label)}
                    className={`flex items-center justify-between px-4 py-3 transition-colors ${
                      isActive(`/${item.label.toLowerCase()}`) 
                        ? 'bg-green-700 font-medium border-l-4 border-yellow-400' 
                        : 'hover:bg-green-700 hover:border-l-4 hover:border-yellow-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3">{item.icon}</span>
                      <span className="text-sm">{item.label}</span>
                    </div>
                    {expandedMenus[item.label] ? (
                      <FaChevronDown className="text-xs" />
                    ) : (
                      <FaChevronRight className="text-xs" />
                    )}
                  </div>
                  
                  {expandedMenus[item.label] && (
                    <ul className="ml-8 py-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.path}>
                          <Link
                            to={subItem.path}
                            className={`flex items-center px-3 py-2 text-sm rounded transition-colors ${
                              isActive(subItem.path) 
                                ? 'bg-green-700 font-medium' 
                                : 'hover:bg-green-700'
                            }`}
                          >
                            <span className="mr-2">{subItem.icon}</span>
                            {subItem.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-green-700 text-xs text-green-200 bg-green-900">
        <div className="font-medium mb-1">FarmConnect Pro</div>
        <div>© {new Date().getFullYear()} Helping Farmers Grow</div>
      </div>
    </div>
  );
};

export default Sidebar;
