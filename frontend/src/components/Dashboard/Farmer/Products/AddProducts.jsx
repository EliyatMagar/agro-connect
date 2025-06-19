import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiUpload, FiPlus } from 'react-icons/fi';

const AddProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    NameEn: '',
    NameNp: '',
    DescriptionEn: '',
    DescriptionNp: '',
    Category: '',
    Quantity: 0,
    Unit: '',
    PricePerUnit: 0,
    AvailableFrom: '',
    AvailableTo: '',
    Status: 'available'
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const categories = [
    { value: 'vegetable', label: 'Vegetable', icon: '🥦' },
    { value: 'fruit', label: 'Fruit', icon: '🍎' },
    { value: 'dairy', label: 'Dairy Product', icon: '🥛' },
    { value: 'meat', label: 'Meat', icon: '🍗' },
    { value: 'other', label: 'Other', icon: '🌾' }
  ];

  const units = {
    vegetable: [
      { value: 'kg', label: 'kg' },
      { value: 'g', label: 'g' },
      { value: 'piece', label: 'Piece' },
      { value: 'bunch', label: 'Bunch' },
      { value: 'dozen', label: 'Dozen' }
    ],
    fruit: [
      { value: 'kg', label: 'kg' },
      { value: 'g', label: 'g' },
      { value: 'piece', label: 'Piece' },
      { value: 'dozen', label: 'Dozen' }
    ],
    dairy: [
      { value: 'litre', label: 'Litre' },
      { value: 'ml', label: 'ml' },
      { value: 'kg', label: 'kg' },
      { value: 'g', label: 'g' },
      { value: 'piece', label: 'Piece' },
      { value: 'packet', label: 'Packet' }
    ],
    meat: [
      { value: 'kg', label: 'kg' },
      { value: 'g', label: 'g' },
      { value: 'piece', label: 'Piece' }
    ],
    other: [
      { value: 'kg', label: 'kg' },
      { value: 'g', label: 'g' },
      { value: 'litre', label: 'Litre' },
      { value: 'ml', label: 'ml' },
      { value: 'piece', label: 'Piece' },
      { value: 'packet', label: 'Packet' },
      { value: 'bottle', label: 'Bottle' },
      { value: 'box', label: 'Box' }
    ]
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Reset unit when category changes
    if (name === 'Category') {
      setProduct(prev => ({
        ...prev,
        Unit: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Convert to backend expected format
      const productData = {
        name_en: product.NameEn,
        name_np: product.NameNp,
        description_en: product.DescriptionEn,
        description_np: product.DescriptionNp,
        category: product.Category,
        quantity: parseFloat(product.Quantity),
        unit: product.Unit,
        price_per_unit: parseFloat(product.PricePerUnit),
        available_from: product.AvailableFrom,
        available_to: product.AvailableTo,
        status: product.Status
      };

      const formData = new FormData();
      formData.append('data', JSON.stringify(productData));
      if (image) {
        formData.append('image', image);
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch('http://localhost:8080/products/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create product');
      }

      const result = await response.json();
      console.log('Product created:', result);
      navigate('/farmer-dashboard');
    } catch (err) {
      setError(err.message);
      console.error('Error creating product:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentUnits = () => {
    return units[product.Category] || units.other;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden"
      >
        {/* Header with back button */}
        <div className="bg-indigo-600 p-4 flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-indigo-700 text-white hover:bg-indigo-800 transition-colors mr-4"
            aria-label="Go back"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Add New Farm Product</h1>
            <p className="text-indigo-100">Fill in details about your fresh produce</p>
          </div>
        </div>

        {/* Form content */}
        <div className="p-6">
          {error && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
            >
              {error}
            </motion.div>
          )}
          
          <motion.form
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit}
            className="space-y-6"
            encType="multipart/form-data"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="NameEn"
                  value={product.NameEn}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Fresh Tomatoes"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name (Nepali)
                </label>
                <input
                  type="text"
                  name="NameNp"
                  value={product.NameNp}
                  onChange={handleChange}
                  placeholder="e.g. ताजा गोलभेंडा"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (English)
                </label>
                <textarea
                  name="DescriptionEn"
                  value={product.DescriptionEn}
                  onChange={handleChange}
                  placeholder="Describe your product (organic, fresh, etc.)"
                  rows="3"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Nepali)
                </label>
                <textarea
                  name="DescriptionNp"
                  value={product.DescriptionNp}
                  onChange={handleChange}
                  placeholder="उत्पादनको बारेमा विवरण (जैविक, ताजा, आदि)"
                  rows="3"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <span className="bg-gray-100 p-2 rounded-full mr-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                  </svg>
                </span>
                Product Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="Category"
                    value={product.Category}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.icon} {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="Quantity"
                    value={product.Quantity}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="Unit"
                    value={product.Unit}
                    onChange={handleChange}
                    required
                    disabled={!product.Category}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                  >
                    <option value="">Select unit</option>
                    {getCurrentUnits().map((unit) => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <span className="bg-gray-100 p-2 rounded-full mr-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </span>
                Pricing & Availability
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Per Unit (Rs.) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="PricePerUnit"
                    value={product.PricePerUnit}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available From
                  </label>
                  <input
                    type="date"
                    name="AvailableFrom"
                    value={product.AvailableFrom}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available To
                  </label>
                  <input
                    type="date"
                    name="AvailableTo"
                    value={product.AvailableTo}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload a photo</span>
                      <input
                        id="file-upload"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              </div>
              {image && (
                <motion.div 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="mt-2 text-sm text-gray-600 flex items-center"
                >
                  <FiUpload className="mr-2" />
                  Selected: {image.name}
                </motion.div>
              )}
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="flex justify-end pt-4 border-t border-gray-200"
            >
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="mr-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>
                    <FiPlus className="-ml-1 mr-2 h-4 w-4" />
                    Add Product
                  </>
                )}
              </button>
            </motion.div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddProduct;