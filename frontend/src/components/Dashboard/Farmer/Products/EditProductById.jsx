import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiUpload, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditProductById = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name_en: '',
    name_np: '',
    description_en: '',
    description_np: '',
    category: '',
    quantity: '',
    unit: '',
    price_per_unit: '',
    available_from: '',
    available_to: '',
    status: 'available',
    image_url: ''
  });
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableUnits, setAvailableUnits] = useState([]);

  const categories = [
    { value: 'vegetable', label: 'Vegetable' },
    { value: 'fruit', label: 'Fruit' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'meat', label: 'Meat' },
    { value: 'other', label: 'Other' }
  ];

  const unitOptions = {
    vegetable: ['kg', 'g', 'piece', 'bunch', 'dozen'],
    fruit: ['kg', 'g', 'piece', 'dozen'],
    dairy: ['litre', 'ml', 'kg', 'g', 'piece', 'packet'],
    meat: ['kg', 'g', 'piece'],
    other: ['kg', 'g', 'litre', 'ml', 'piece', 'packet', 'bottle', 'box']
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8080/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProduct({
          ...response.data,
          // Ensure numeric fields are strings for controlled inputs
          quantity: response.data.quantity.toString(),
          price_per_unit: response.data.price_per_unit.toString()
        });
        if (response.data.category) {
          setAvailableUnits(unitOptions[response.data.category] || []);
        }
      } catch (err) {
        toast.error('Failed to fetch product details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product.category) {
      setAvailableUnits(unitOptions[product.category] || []);
      // Reset unit when category changes
      if (!unitOptions[product.category]?.includes(product.unit)) {
        setProduct(prev => ({ ...prev, unit: '' }));
      }
    }
  }, [product.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate image
    if (!file.type.match('image.*')) {
      setErrors(prev => ({ ...prev, image: 'Please select an image file' }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) { // 2MB
      setErrors(prev => ({ ...prev, image: 'Image must be less than 2MB' }));
      return;
    }

    setNewImage(file);
    setErrors(prev => ({ ...prev, image: '' }));
  };

  const removeImage = () => {
    setNewImage(null);
    setProduct(prev => ({ ...prev, image_url: '' }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!product.name_en.trim()) newErrors.name_en = 'English name is required';
    if (!product.category) newErrors.category = 'Category is required';
    if (!product.quantity || isNaN(product.quantity)) newErrors.quantity = 'Valid quantity is required';
    if (!product.unit) newErrors.unit = 'Unit is required';
    if (!product.price_per_unit || isNaN(product.price_per_unit)) newErrors.price_per_unit = 'Valid price is required';
    if (product.available_from && product.available_to) {
      if (new Date(product.available_to) < new Date(product.available_from)) {
        newErrors.available_to = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  if (!validateForm()) {
    setIsSubmitting(false);
    return;
  }

  try {
    const token = localStorage.getItem('token');
    
    // Prepare the product data
    const productData = {
      name_en: product.name_en,
      name_np: product.name_np,
      description_en: product.description_en,
      description_np: product.description_np,
      category: product.category,
      quantity: parseFloat(product.quantity),
      unit: product.unit,
      price_per_unit: parseFloat(product.price_per_unit),
      available_from: product.available_from,
      available_to: product.available_to,
      status: product.status,
    };

    let response;
    
    if (newImage) {
      const formData = new FormData();
      
      // Append the product data as a JSON string
      formData.append('data', JSON.stringify(productData));
      
      // Append the image file
      formData.append('image', newImage);

      response = await axios.put(`http://localhost:8080/products/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          // Let axios set the Content-Type with boundary automatically
        }
      });
    } else {
      // For non-image updates, include the image_url if it exists
      const payload = product.image_url 
        ? { ...productData, image_url: product.image_url } 
        : productData;

      response = await axios.put(`http://localhost:8080/products/${id}`, payload, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    }

    toast.success('Product updated successfully');
    navigate('/farmer-dashboard');
  } catch (err) {
    console.error('Update error:', err.response?.data || err);
    const errorMessage = err.response?.data?.error || 
                       err.response?.data?.message || 
                       err.message || 
                       'Failed to update product';
    toast.error(errorMessage);
    
    if (err.response?.data?.errors) {
      setErrors(err.response.data.errors);
    }
  } finally {
    setIsSubmitting(false);
  }
};

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-green-600 mb-4 hover:text-green-800 transition-colors"
      >
        <FiArrowLeft className="mr-2" /> Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name (English) *
            </label>
            <input
              type="text"
              name="name_en"
              value={product.name_en}
              onChange={handleChange}
              className={`w-full p-2 border rounded focus:ring-green-500 focus:border-green-500 ${
                errors.name_en ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name_en && (
              <p className="mt-1 text-sm text-red-600">{errors.name_en}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name (Nepali)
            </label>
            <input
              type="text"
              name="name_np"
              value={product.name_np}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (English)
            </label>
            <textarea
              name="description_en"
              value={product.description_en}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Nepali)
            </label>
            <textarea
              name="description_np"
              value={product.description_np}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              className={`w-full p-2 border rounded focus:ring-green-500 focus:border-green-500 ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity *
            </label>
            <input
              type="number"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              className={`w-full p-2 border rounded focus:ring-green-500 focus:border-green-500 ${
                errors.quantity ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit *
            </label>
            <select
              name="unit"
              value={product.unit}
              onChange={handleChange}
              disabled={!product.category}
              className={`w-full p-2 border rounded focus:ring-green-500 focus:border-green-500 ${
                errors.unit ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select unit</option>
              {availableUnits.map(unit => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
            {errors.unit && (
              <p className="mt-1 text-sm text-red-600">{errors.unit}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Per Unit (Rs.) *
            </label>
            <input
              type="number"
              name="price_per_unit"
              value={product.price_per_unit}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              className={`w-full p-2 border rounded focus:ring-green-500 focus:border-green-500 ${
                errors.price_per_unit ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.price_per_unit && (
              <p className="mt-1 text-sm text-red-600">{errors.price_per_unit}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Available From
            </label>
            <input
              type="date"
              name="available_from"
              value={formatDate(product.available_from)}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Available To
            </label>
            <input
              type="date"
              name="available_to"
              value={formatDate(product.available_to)}
              onChange={handleChange}
              min={product.available_from ? formatDate(product.available_from) : undefined}
              className={`w-full p-2 border rounded focus:ring-green-500 focus:border-green-500 ${
                errors.available_to ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.available_to && (
              <p className="mt-1 text-sm text-red-600">{errors.available_to}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status *
          </label>
          <select
            name="status"
            value={product.status}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
          >
            <option value="available">Available</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="coming_soon">Coming Soon</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Image
          </label>
          <div className="space-y-2">
            {(product.image_url || newImage) && (
              <div className="flex items-center space-x-4">
                <img 
                  src={newImage ? 
                    URL.createObjectURL(newImage) : 
                    `http://localhost:8080${product.image_url}`
                  }
                  alt="Product preview" 
                  className="h-32 w-32 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="text-red-600 hover:text-red-800 flex items-center"
                >
                  <FiTrash2 className="mr-1" /> Remove
                </button>
              </div>
            )}
            
            <label className="cursor-pointer inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-md hover:bg-green-200 transition-colors">
              <FiUpload className="mr-2" />
              {newImage ? 'Change Image' : product.image_url ? 'Change Image' : 'Upload Image'}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">{errors.image}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 space-x-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400 transition-colors"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <FiSave className="mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductById;