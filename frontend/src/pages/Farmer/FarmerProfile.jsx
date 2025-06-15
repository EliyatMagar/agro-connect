import React from "react";
import Profile_info from "./Profile_info";
import Farm_info from "./Farm_info";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // ✅ Import

const FarmerProfile = () => {
  const navigate = useNavigate(); // ✅ Initialize

  const handleUpdateClick = () => {
    navigate("/update-farm"); // ✅ Navigate to update page
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-green-50 to-green-200 p-6">
      <motion.div
        className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden grid md:grid-cols-2 gap-6 p-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="border-r border-green-100 pr-4"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-green-700 mb-4 border-b pb-2">
            👤 Farmer Info
          </h2>
          <Profile_info />
        </motion.div>

        <motion.div
          className="pl-4"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-green-700 mb-4 border-b pb-2">
            🌾 Farm Details
          </h2>
          <Farm_info />
        </motion.div>
      </motion.div>

      <div className="text-center mt-6">
        <button
          onClick={handleUpdateClick}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-md transition-all"
        >
          ✏️ Update Farm
        </button>
      </div>
    </div>
  );
};

export default FarmerProfile;
