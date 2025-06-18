import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

  const categories = [
    { value: 'vegetable', label: 'Vegetable' },
    { value: 'fruit', label: 'Fruit' },
    { value: 'dairy', label: 'Dairy Product' },
    { value: 'meat', label: 'Meat' },
    { value: 'other', label: 'Other' }
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
      navigate('/getallproducts');
    } catch (err) {
      setError(err.message);
      console.error('Error creating product:', err);
    }
  };

  const getCurrentUnits = () => {
    return units[product.Category] || units.other;
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name (English)</label>
            <input
              type="text"
              name="NameEn"
              value={product.NameEn}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Name (Nepali)</label>
            <input
              type="text"
              name="NameNp"
              value={product.NameNp}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Description (English)</label>
            <textarea
              name="DescriptionEn"
              value={product.DescriptionEn}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Description (Nepali)</label>
            <textarea
              name="DescriptionNp"
              value={product.DescriptionNp}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="Category"
              value={product.Category}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              name="Quantity"
              value={product.Quantity}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Unit</label>
            <select
              name="Unit"
              value={product.Unit}
              onChange={handleChange}
              required
              disabled={!product.Category}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
            >
              <option value="">Select a unit</option>
              {getCurrentUnits().map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Price Per Unit</label>
            <input
              type="number"
              name="PricePerUnit"
              value={product.PricePerUnit}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Available From</label>
            <input
              type="date"
              name="AvailableFrom"
              value={product.AvailableFrom}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Available To</label>
            <input
              type="date"
              name="AvailableTo"
              value={product.AvailableTo}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Product Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;