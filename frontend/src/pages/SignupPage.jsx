import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser } from "react-icons/fa";

const Signup = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "farmer",
    language: "",
    phone: "",
    address: "",
    district: "",
    province: "",
  });

  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePictureFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value)
      );
      if (profilePictureFile) {
        data.append("profile_picture", profilePictureFile);
      }

      await axios.post("http://localhost:8080/register", data, {
        headers: { "Content-Type": "application/json" },
      });

      alert("Signup successful!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-lime-200 px-4">
      <motion.div
        className="bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-3xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-extrabold text-center text-green-700 mb-6 tracking-wider">
          Join <span className="text-green-600">AgroConnect</span>
        </h2>

        {/* Profile Picture Upload and Preview */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-28 h-28 rounded-full bg-gray-100 border-4 border-green-300 overflow-hidden mb-2 shadow">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUser className="text-5xl text-gray-400 mt-6 mx-auto" />
            )}
          </div>
          <label className="text-green-700 cursor-pointer hover:underline font-medium">
            Upload Profile Picture
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Signup Form */}
        <form
          onSubmit={handleSignup}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          encType="multipart/form-data"
        >
          <input
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Full Name"
            className="input-style"
            required
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            type="email"
            className="input-style"
            required
          />
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create Password"
            type="password"
            className="input-style"
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="input-style"
          >
            <option value="farmer">Farmer</option>
            <option value="buyer">Buyer</option>
            <option value="transporter">Transporter</option>
          </select>
          <input
            name="language"
            value={formData.language}
            onChange={handleChange}
            placeholder="Preferred Language"
            className="input-style"
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="input-style"
            required
          />
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Full Address"
            className="input-style"
          />
          <input
            name="district"
            value={formData.district}
            onChange={handleChange}
            placeholder="District"
            className="input-style"
          />
          <input
            name="province"
            value={formData.province}
            onChange={handleChange}
            placeholder="Province"
            className="input-style"
          />

          {/* Submit Button goes outside form grid */}
        </form>

        {/* Terms Agreement */}
        <div className="flex items-center space-x-2 mt-4">
          <input type="checkbox" required className="accent-green-600" />
          <label className="text-sm text-gray-600">
            I agree to the{" "}
            <span className="text-green-700 underline cursor-pointer">
              Terms & Conditions
            </span>.
          </label>
        </div>

        {/* Submit Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
          type="submit"
          onClick={handleSignup}
          disabled={isSubmitting}
          className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl shadow-md hover:bg-green-700 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Signing Up..." : "Sign Up"}
        </motion.button>

        <p className="text-sm mt-5 text-center text-gray-700">
          Already have an account?{" "}
          <Link to="/" className="text-green-600 font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
