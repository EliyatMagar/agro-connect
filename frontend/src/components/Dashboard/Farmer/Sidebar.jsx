import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, FaPlusCircle, FaBox, 
  FaChartLine, FaUserCog, FaTimes,
  FaChevronDown, FaChevronRight
} from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = React.useState({});

  const navItems = [
    { 
      path: '/farmer-dashboard', 
      icon: <FaHome className="text-lg" />, 
      label: 'Dashboard',
      exact: true
    },
    { 
      label: 'Products',
      icon: <FaBox className="text-lg" />,
      subItems: [
        { 
          path: '/products/addproductsByFarmer', 
          icon: <FaPlusCircle className="text-sm" />, 
          label: 'Add Product' 
        },
        { 
          path: '/products/manage', 
          icon: <FaBox className="text-sm" />, 
          label: 'Manage Products' 
        },
      ]
    },
    { 
      path: '/farmer/stats', 
      icon: <FaChartLine className="text-lg" />, 
      label: 'Statistics' 
    },
    { 
      path: '/farmer/settings', 
      icon: <FaUserCog className="text-lg" />, 
      label: 'Settings' 
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
      w-64 bg-green-700 text-white z-50 md:z-0 flex flex-col`}>
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-indigo-600">
        <h1 className="text-xl font-bold flex items-center">
          <span className="bg-white text-indigo-700 rounded-lg p-1 mr-2">
            <FaBox />
          </span>
          Farmer Portal
        </h1>
        <button 
          onClick={toggleSidebar} 
          className="md:hidden p-1 rounded-full hover:bg-indigo-600"
          aria-label="Toggle sidebar"
        >
          <FaTimes className="text-xl" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        <ul>
          {navItems.map((item) => (
            <li key={item.path || item.label}>
              {item.path ? (
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 transition-colors ${
                    isActive(item.path, item.exact) 
                      ? 'bg-indigo-800 font-medium' 
                      : 'hover:bg-indigo-600'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              ) : (
                <div className="cursor-pointer">
                  <div 
                    onClick={() => toggleMenu(item.label)}
                    className={`flex items-center justify-between px-4 py-3 transition-colors ${
                      isActive(`/${item.label.toLowerCase()}`) 
                        ? 'bg-indigo-800 font-medium' 
                        : 'hover:bg-indigo-600'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </div>
                    {expandedMenus[item.label] ? (
                      <FaChevronDown className="text-xs" />
                    ) : (
                      <FaChevronRight className="text-xs" />
                    )}
                  </div>
                  
                  {expandedMenus[item.label] && (
                    <ul className="ml-8 py-1">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.path}>
                          <Link
                            to={subItem.path}
                            className={`flex items-center px-3 py-2 text-sm rounded transition-colors ${
                              isActive(subItem.path) 
                                ? 'bg-indigo-900 font-medium' 
                                : 'hover:bg-indigo-600'
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
      <div className="p-4 border-t border-indigo-600 text-xs text-indigo-200">
        <div>AgroConnect v1.0</div>
        <div>© {new Date().getFullYear()} Farmer Portal</div>
      </div>
    </div>
  );
};

export default Sidebar;