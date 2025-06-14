import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiHome,
  FiShoppingCart,
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
    farmer: <GiFarmer className="inline mr-2 text-green-600" />,
    transporter: <GiCargoShip className="inline mr-2 text-blue-600" />,
    buyer: <GiShop className="inline mr-2 text-purple-600" />,
  };

  const roleLabel = {
    farmer: "Farmer",
    transporter: "Transporter",
    buyer: "Buyer",
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Blog", path: "/blog" },
    { name: "Explore", path: "/explore" },
    { name: "Cart", path: "/cart" },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">
          Agro-connect
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <motion.div
              key={link.name}
              whileHover={{ scale: 1.1 }}
              className="transition-transform"
            >
              <Link
                to={link.path}
                className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
              >
                {link.name === "Cart" && <FiShoppingCart className="text-lg" />}
                {link.name}
              </Link>
            </motion.div>
          ))}

          {!isLoggedIn ? (
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Login
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                {roleIcon[role?.toLowerCase()] || <FiUser />}
                {roleLabel[role?.toLowerCase()] || "User"}
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                  >
                    <p className="px-4 py-2 text-sm text-gray-600">
                      Welcome, <strong>{username}</strong>
                    </p>
                    <Link
                      to={getDashboardPath()}
                      className="flex items-center px-4 py-2 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FiHome className="mr-2" /> Dashboard
                    </Link>
                    <Link
                      to={getProfilePath()}
                      className="flex items-center px-4 py-2 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FiUser className="mr-2" /> Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      <FiLogOut className="mr-2" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={toggleMenu}>
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
            className="md:hidden px-4 pb-4 overflow-hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={toggleMenu}
                className="block py-2 text-gray-700 hover:text-blue-600 flex items-center gap-2"
              >
                {link.name === "Cart" && <FiShoppingCart />} {link.name}
              </Link>
            ))}

            {!isLoggedIn ? (
              <Link
                to="/login"
                onClick={toggleMenu}
                className="block mt-2 bg-blue-600 text-white text-center px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Login
              </Link>
            ) : (
              <div className="mt-2 border-t pt-2">
                <p className="text-gray-700 text-sm mb-1">
                  Logged in as{" "}
                  <strong>{roleLabel[role?.toLowerCase()]}</strong> -{" "}
                  {username}
                </p>
                <Link
                  to={getDashboardPath()}
                  onClick={toggleMenu}
                  className="block py-2 text-gray-700 hover:text-blue-600"
                >
                  Dashboard
                </Link>
                <Link
                  to={getProfilePath()}
                  onClick={toggleMenu}
                  className="block py-2 text-gray-700 hover:text-blue-600"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="block w-full text-left py-2 text-gray-700 hover:text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
