import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateBuyerProfile = () => {
  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user_id: Number(userData.id) || 0,
    business_name: "",
    business_type: "RETAILER",
    pan_number: "",
    vat_number: "",
    business_reg_no: "",
    contact_person: userData.name || "",
    contact_phone: userData.phone || "",
    business_address: userData.address || "",
    district: userData.district || "",
    municipality: "",
    ward_number: 0,
    verified: false,
    buyer_category: "SMALL",
    profile_photo: ""
  });

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [fileError, setFileError] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "ward_number" ? parseInt(value) || 0 : value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(selectedFile.type)) {
      setFileError("Only JPEG, PNG, or GIF images are allowed");
      return;
    }

    // Validate file size (5MB max)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setFileError("File size must be less than 5MB");
      return;
    }

    setFile(selectedFile);
    setFileError("");

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Client-side validation
    const requiredFields = {
      business_name: "Business name is required",
      contact_phone: "Contact phone is required",
      district: "District is required"
    };

    const newErrors = {};
    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!formData[field]) newErrors[field] = message;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      // First create the profile
      const response = await axios.post(
        "http://localhost:8080/buyer-profile/",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      // If we have a file, upload it separately
      if (file) {
        const formDataPhoto = new FormData();
        formDataPhoto.append("profile_photo", file);

        await axios.post(
          `http://localhost:8080/buyer-profile/${response.data.profile.ID}/photo`,
          formDataPhoto,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
      }

      // Navigate to buyer profile page after successful creation
      navigate(`/buyer-profile/${formData.user_id}`);

    } catch (error) {
      console.error("Error creating profile:", error);
      
      if (error.response) {
        if (error.response.status === 409) {
          // This shouldn't happen since RoleProtectedRoute checks first
          setErrors({ general: "Profile already exists. Redirecting..." });
          setTimeout(() => navigate(`/buyer-profile/${formData.user_id}`), 2000);
        } else if (error.response.status === 400) {
          if (error.response.data.error) {
            setErrors({ general: error.response.data.error });
          } else if (error.response.data.errors) {
            const serverErrors = {};
            error.response.data.errors.forEach(err => {
              serverErrors[err.field] = err.message;
            });
            setErrors(serverErrors);
          }
        } else {
          setErrors({ general: error.response.data.message || "An error occurred" });
        }
      } else {
        setErrors({ general: "Network error. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Buyer Profile</h2>
      
      {errors.general && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Business Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-2">Business Information</h3>
          </div>
          
          <div className="md:col-span-2">
            <label className="block mb-1">Business Name*</label>
            <input
              type="text"
              name="business_name"
              value={formData.business_name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            {errors.business_name && <p className="text-red-500 text-sm">{errors.business_name}</p>}
          </div>
          
          <div>
            <label className="block mb-1">Business Type</label>
            <select
              name="business_type"
              value={formData.business_type}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="WHOLESALER">Wholesaler</option>
              <option value="RESTAURANT">Restaurant</option>
              <option value="RETAILER">Retailer</option>
              <option value="HOTEL">Hotel</option>
              <option value="PROCESSOR">Processor</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-1">Buyer Category</label>
            <select
              name="buyer_category"
              value={formData.buyer_category}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="SMALL">Small</option>
              <option value="MEDIUM">Medium</option>
              <option value="LARGE">Large</option>
              <option value="INSTITUTIONAL">Institutional</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-1">PAN Number</label>
            <input
              type="text"
              name="pan_number"
              value={formData.pan_number}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              maxLength="15"
            />
          </div>
          
          <div>
            <label className="block mb-1">VAT Number</label>
            <input
              type="text"
              name="vat_number"
              value={formData.vat_number}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              maxLength="20"
            />
          </div>
          
          <div>
            <label className="block mb-1">Business Registration No</label>
            <input
              type="text"
              name="business_reg_no"
              value={formData.business_reg_no}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              maxLength="30"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
          </div>
          
          <div>
            <label className="block mb-1">Contact Person</label>
            <input
              type="text"
              name="contact_person"
              value={formData.contact_person}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block mb-1">Contact Phone*</label>
            <input
              type="text"
              name="contact_phone"
              value={formData.contact_phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            {errors.contact_phone && <p className="text-red-500 text-sm">{errors.contact_phone}</p>}
          </div>
        </div>

        {/* Address Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-2">Address Information</h3>
          </div>
          
          <div className="md:col-span-2">
            <label className="block mb-1">Business Address</label>
            <textarea
              name="business_address"
              value={formData.business_address}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="2"
            />
          </div>
          
          <div>
            <label className="block mb-1">District*</label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            {errors.district && <p className="text-red-500 text-sm">{errors.district}</p>}
          </div>
          
          <div>
            <label className="block mb-1">Municipality</label>
            <input
              type="text"
              name="municipality"
              value={formData.municipality}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block mb-1">Ward Number</label>
            <input
              type="number"
              name="ward_number"
              value={formData.ward_number}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>
        </div>

        {/* Profile Photo Upload */}
        <div className="mt-6">
          <label className="block mb-2 font-medium">Profile Photo</label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="file"
                accept="image/jpeg, image/png, image/gif"
                onChange={handleFileChange}
                className="w-full p-2 border rounded"
              />
              {fileError && <p className="text-red-500 text-sm mt-1">{fileError}</p>}
              <p className="text-sm text-gray-500 mt-1">Max file size: 5MB (JPEG, PNG, GIF)</p>
            </div>
            {previewUrl && (
              <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : "Create Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBuyerProfile;