import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // 👈 Import

const Update_farm = () => {
  const [formData, setFormData] = useState({
    farm_name: "",
    farm_size: "",
    farm_location: "",
    certifications: "",
  });
  const [profileId, setProfileId] = useState(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const farmerName = user?.name;

  const navigate = useNavigate(); // 👈 Initialize navigate

  useEffect(() => {
    const fetchFarmData = async () => {
      try {
        const res = await axios.get("http://localhost:8080/farmer-profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const myProfile = res.data.profiles.find((p) => p.user_id === userId);
        if (myProfile) {
          setProfileId(myProfile.ID);
          setFormData({
            farm_name: myProfile.farm_name,
            farm_size: myProfile.farm_size,
            farm_location: myProfile.farm_location,
            certifications: myProfile.certifications,
          });
        } else {
          alert("No farm profile found for your account.");
        }
      } catch (err) {
        console.error("Failed to fetch farm profile:", err);
        alert("Failed to load your farm data.");
      }
    };

    if (userId && token) {
      fetchFarmData();
    }
  }, [userId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        user_id: userId,
        farmer_name: farmerName,
        ...formData,
      };

      await axios.put(
        `http://localhost:8080/farmer-profile/${profileId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("✅ Farm profile updated successfully.");
      navigate("/farmer-profile"); 
    } catch (error) {
      console.error("Update error:", error);
      alert("❌ Failed to update farm profile.");
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
          Update Farm Profile
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            type="text"
            name="farm_name"
            value={formData.farm_name}
            onChange={handleChange}
            placeholder="Farm Name"
            className="p-3 border rounded"
            required
          />
          <input
            type="number"
            name="farm_size"
            value={formData.farm_size}
            onChange={handleChange}
            placeholder="Farm Size (in Ropani or Bigha)"
            className="p-3 border rounded"
            required
          />
          <input
            type="text"
            name="farm_location"
            value={formData.farm_location}
            onChange={handleChange}
            placeholder="Farm Location"
            className="p-3 border rounded"
            required
          />
          <input
            type="text"
            name="certifications"
            value={formData.certifications}
            onChange={handleChange}
            placeholder="Certifications (Organic, GAP, etc)"
            className="p-3 border rounded"
          />

          <button
            type="submit"
            className="bg-green-600 text-white py-3 rounded hover:bg-green-700 transition-all"
          >
            Update Farm Info
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Update_farm;
