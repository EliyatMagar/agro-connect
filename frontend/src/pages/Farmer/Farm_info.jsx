import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaTractor, FaSeedling, FaMapMarkedAlt, FaCertificate, FaUser } from "react-icons/fa";

const Farm_info = () => {
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:8080/farmer-profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const foundProfile = res.data.profiles.find(p => p.user_id === userId);
        setProfile(foundProfile);
      } catch (error) {
        console.error("Error fetching farm profile:", error);
      }
    };

    if (token && userId) {
      fetchProfile();
    }
  }, [token, userId]);

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-green-700 flex items-center gap-2 mb-4">
        <FaTractor /> Farm Profile
      </h2>

      {profile ? (
        <div className="space-y-4 text-gray-800">
          <div className="flex items-center gap-3">
            <FaUser className="text-green-600" />
            <span><strong>Farmer:</strong> {profile.farmer_name}</span>
          </div>
          <div className="flex items-center gap-3">
            <FaSeedling className="text-green-600" />
            <span><strong>Farm Name:</strong> {profile.farm_name}</span>
          </div>
          <div className="flex items-center gap-3">
            <FaTractor className="text-green-600" />
            <span><strong>Farm Size:</strong> {profile.farm_size} Ropani</span>
          </div>
          <div className="flex items-center gap-3">
            <FaMapMarkedAlt className="text-green-600" />
            <span><strong>Location:</strong> {profile.farm_location}</span>
          </div>
          <div className="flex items-center gap-3">
            <FaCertificate className="text-green-600" />
            <span><strong>Certifications:</strong> {profile.certifications}</span>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 italic">Loading profile or no data available.</p>
      )}
    </motion.div>
  );
};

export default Farm_info;
