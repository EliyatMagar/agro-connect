import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  UserGroupIcon,
  ShoppingCartIcon,
  TruckIcon,
} from "@heroicons/react/outline";

function Home() {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        duration: 0.5,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Parallax effect state
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.pageYOffset);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
        /* Smooth scrolling globally */
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      <div className="bg-green-50 min-h-screen flex flex-col">
        <Navbar />

        {/* Hero Section */}
        <motion.section
          className="text-center py-20 px-6 relative overflow-hidden text-white"
          initial="hidden"
          animate="visible"
          variants={container}
          style={{
            backgroundImage:
              "linear-gradient(rgba(5, 150, 105, 0.8), rgba(5, 150, 105, 0.8)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80')",
            backgroundPositionY: offsetY * 0.5,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg"
            variants={item}
          >
            Welcome to AgroConnect
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto drop-shadow"
            variants={item}
          >
            Bridging Farmers, Buyers, and Transporters Across Nepal — Your
            Agriculture Network Simplified.
          </motion.p>
          <motion.div className="flex justify-center space-x-6" variants={item}>
            <Link
              to="/register"
              className="bg-white text-green-700 font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-green-100 transition"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white hover:text-green-700 transition font-semibold"
            >
              Login
            </Link>
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          className="py-16 px-6 max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={container}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg p-8 flex-1 text-center"
            variants={item}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 20px rgba(16,185,129,0.4)",
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <UserGroupIcon className="mx-auto h-16 w-16 text-green-600 mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-green-700">For Farmers</h3>
            <p className="text-gray-700">
              List your crops, connect directly with buyers, and get support for
              logistics and transport.
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow-lg p-8 flex-1 text-center"
            variants={item}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 20px rgba(16,185,129,0.4)",
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <ShoppingCartIcon className="mx-auto h-16 w-16 text-green-600 mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-green-700">For Buyers</h3>
            <p className="text-gray-700">
              Discover verified local farmers and purchase fresh, quality produce
              effortlessly.
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow-lg p-8 flex-1 text-center"
            variants={item}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 20px rgba(16,185,129,0.4)",
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <TruckIcon className="mx-auto h-16 w-16 text-green-600 mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-green-700">For Transporters</h3>
            <p className="text-gray-700">
              Get delivery requests and play a vital role in connecting farmers and
              buyers quickly.
            </p>
          </motion.div>
        </motion.section>

        {/* Footer */}
        <footer className="text-center py-6 text-sm text-gray-500 mt-auto">
          © {new Date().getFullYear()} AgroConnect. All rights reserved.
        </footer>
      </div>
    </>
  );
}

export default Home;
