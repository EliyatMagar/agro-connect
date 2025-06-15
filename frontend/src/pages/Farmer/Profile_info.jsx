import React from "react";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaPhone, FaLanguage, FaMapMarkedAlt, FaCheckCircle, FaUserTag, FaGlobeAsia } from "react-icons/fa";

const Profile_info = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");

  if (!user) {
    return (
      <motion.div
        className="p-6 text-red-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        No user data found.
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white shadow-lg rounded-2xl p-6 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2">
        <FaUser className="text-green-600" />
        Personal Information
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
        <ProfileField icon={<FaUser />} label="Name" value={user.name} />
        <ProfileField icon={<FaEnvelope />} label="Email" value={user.email} />
        <ProfileField icon={<FaPhone />} label="Phone" value={user.phone} />
        <ProfileField icon={<FaLanguage />} label="Language" value={user.language} />
        <ProfileField icon={<FaGlobeAsia />} label="Province" value={user.province} />
        <ProfileField icon={<FaMapMarkedAlt />} label="District" value={user.district} />
        <ProfileField icon={<FaMapMarkedAlt />} label="Address" value={user.address} />
        <ProfileField icon={<FaCheckCircle />} label="Verified" value={user.verified ? "Yes" : "No"} />
        <ProfileField icon={<FaUserTag />} label="Role" value={role} />
      </div>

      {user["profile-picture"] && (
        <div className="mt-6 text-center">
          <img
            src={user["profile-picture"]}
            alt="Profile"
            className="w-28 h-28 mx-auto rounded-full object-cover shadow-md"
          />
        </div>
      )}
    </motion.div>
  );
};

const ProfileField = ({ icon, label, value }) => (
  <div className="flex items-start gap-2">
    <div className="text-green-600 mt-1">{icon}</div>
    <div>
      <span className="text-sm text-gray-500">{label}</span>
      <div className="text-base font-medium">{value || "—"}</div>
    </div>
  </div>
);

export default Profile_info;
