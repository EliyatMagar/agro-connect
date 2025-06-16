import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiHome,
  FiShoppingCart,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { GiFarmer, GiCargoShip, GiShop } from "react-icons/gi";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    const userData = JSON.parse(localStorage.getItem("user"));
    if (token && userRole && userData) {
      setIsLoggedIn(true);
      setRole(userRole);
      setUsername(userData.name || "User");
    }
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setDropdownOpen(false);
    navigate("/login");
  };

  const getDashboardPath = () => {
    if (role === "farmer") return "/farmer-dashboard";
    if (role === "buyer") return "/buyer-dashboard";
    if (role === "transporter") return "/transporter-dashboard";
    return "/dashboard";
  };

  const getProfilePath = () => {
    if (role === "farmer") return "/farmer-profile";
    if (role === "buyer") return "/buyer-profile";
    if (role === "transporter") return "/transporter-profile";
    return "/profile";
  };

  const roleIcon = {
    farmer: <GiFarmer className="inline mr-2 text-green-600" size={18} />,
    transporter: <GiCargoShip className="inline mr-2 text-blue-600" size={18} />,
    buyer: <GiShop className="inline mr-2 text-purple-600" size={18} />,
  };

  const roleLabel = {
    farmer: "Farmer",
    transporter: "Transporter",
    buyer: "Buyer",
  };

  const navLinks = [
    { name: "Home", path: "/", icon: <FiHome className="text-lg" /> },
    { name: "Explore", path: "/explore" },
    { name: "Blog", path: "/blog" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Cart", path: "/cart", icon: <FiShoppingCart className="text-lg" /> },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-green-600">AgroConnect</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <motion.div
              key={link.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="transition-transform"
            >
              <Link
                to={link.path}
                className={`flex items-center gap-1 px-2 py-1 rounded-md ${
                  location.pathname === link.path
                    ? "text-green-600 font-medium"
                    : "text-gray-700 hover:text-green-600"
                }`}
              >
                {link.icon && link.icon}
                {link.name}
              </Link>
            </motion.div>
          ))}

          {!isLoggedIn ? (
            <div className="flex gap-3">
              <Link
                to="/login"
                className="bg-green-100 text-green-700 px-4 py-2 rounded-md hover:bg-green-200 transition font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition font-medium"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-md hover:bg-green-100 transition font-medium border border-green-100"
              >
                {roleIcon[role?.toLowerCase()] || <FiUser />}
                <span className="max-w-[100px] truncate">{username}</span>
                {dropdownOpen ? <FiChevronUp /> : <FiChevronDown />}
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {username}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center">
                        {roleIcon[role?.toLowerCase()]}
                        {roleLabel[role?.toLowerCase()] || "User"}
                      </p>
                    </div>
                    <Link
                      to={getDashboardPath()}
                      className="flex items-center px-4 py-3 hover:bg-gray-50 transition"
                    >
                      <FiHome className="mr-3 text-gray-500" /> Dashboard
                    </Link>
                    <Link
                      to={getProfilePath()}
                      className="flex items-center px-4 py-3 hover:bg-gray-50 transition"
                    >
                      <FiUser className="mr-3 text-gray-500" /> Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-50 transition text-red-600"
                    >
                      <FiLogOut className="mr-3" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-gray-50 border-t"
          >
            <div className="container mx-auto px-4 py-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-3 py-3 px-2 rounded-md ${
                    location.pathname === link.path
                      ? "text-green-600 bg-green-50 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {link.icon && link.icon}
                  {link.name}
                </Link>
              ))}

              {!isLoggedIn ? (
                <div className="flex gap-3 mt-4">
                  <Link
                    to="/login"
                    className="flex-1 text-center bg-green-100 text-green-700 px-4 py-2 rounded-md hover:bg-green-200 transition font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 text-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition font-medium"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t">
                  <div className="px-2 mb-3">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {username}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center">
                      {roleIcon[role?.toLowerCase()]}
                      {roleLabel[role?.toLowerCase()] || "User"}
                    </p>
                  </div>
                  <Link
                    to={getDashboardPath()}
                    className="flex items-center gap-3 py-3 px-2 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    <FiHome /> Dashboard
                  </Link>
                  <Link
                    to={getProfilePath()}
                    className="flex items-center gap-3 py-3 px-2 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    <FiUser /> Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full py-3 px-2 rounded-md text-left text-red-600 hover:bg-gray-100"
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}