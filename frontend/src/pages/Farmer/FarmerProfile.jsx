// src/pages/Farmer/FarmerProfile.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const FarmerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    farm_name: "",
    farm_size: "",
    farm_location: "",
    certifications: "",
  });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const farmerName = user?.name;

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:8080/farmer-profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.profiles.find((p) => p.user_id === userId);
      if (data) {
        setProfile(data);
        setFormData({
          farm_name: data.farm_name,
          farm_size: data.farm_size,
          farm_location: data.farm_location,
          certifications: data.certifications,
        });
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      user_id: userId,
      farmer_name: farmerName,
    };

    try {
      await axios.put(
        `http://localhost:8080/farmer-profile/${profile.ID}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Profile updated!");
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || "Something went wrong."));
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          Update Your Farm Profile
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Farmer Name
            </label>
            <input
              type="text"
              value={farmerName || ""}
              disabled
              className="p-3 border rounded bg-gray-100 cursor-not-allowed w-full"
            />
          </div>

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
            placeholder="Farm Size (e.g. in Ropani)"
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
            placeholder="Certifications (e.g. Organic, GAP)"
            className="p-3 border rounded"
          />
          <button
            type="submit"
            className="bg-green-600 text-white py-3 rounded hover:bg-green-700 transition-all"
          >
            Update Profile
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default FarmerProfile;
