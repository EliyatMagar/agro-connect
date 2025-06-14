import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CreateFarmerProfile = () => {
  const [formData, setFormData] = useState({
    farm_name: "",
    farm_size: "",
    farm_location: "",
    certifications: "",
  });

  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const farmerName = user?.name;
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      farm_size: Number(formData.farm_size),
      user_id: userId,
      farmer_name: farmerName,
    };

    try {
      await axios.post("http://localhost:8080/farmer-profile/", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile created!");
      navigate("/farmer-profile");
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || "Something went wrong."));
    } finally {
      setLoading(false);
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
          Create Your Farm Profile
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
            disabled={loading}
          />
          <input
            type="number"
            name="farm_size"
            value={formData.farm_size}
            onChange={handleChange}
            placeholder="Farm Size (e.g. in Ropani)"
            className="p-3 border rounded"
            required
            disabled={loading}
          />
          <input
            type="text"
            name="farm_location"
            value={formData.farm_location}
            onChange={handleChange}
            placeholder="Farm Location"
            className="p-3 border rounded"
            required
            disabled={loading}
          />
          <input
            type="text"
            name="certifications"
            value={formData.certifications}
            onChange={handleChange}
            placeholder="Certifications (e.g. Organic, GAP)"
            className="p-3 border rounded"
            disabled={loading}
          />
          <button
            type="submit"
            className={`bg-green-600 text-white py-3 rounded transition-all hover:bg-green-700 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Profile"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateFarmerProfile;
