import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaBoxOpen, FaRupeeSign, FaCalendarAlt, FaEdit, FaTrash } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";

const FarmerProductById = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    const fetchUserProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await fetch(`http://localhost:8080/products/user`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user products');
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProducts();
  }, [userId]);

  const handleDelete = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      // Remove the deleted product from state
      setProducts(products.filter(product => product.ID !== productId));
    } catch (err) {
      setError(err.message);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8080${imagePath.replace(/\\/g, '/')}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FiLoader className="animate-spin text-4xl text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-auto max-w-2xl mt-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">My Products</h1>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4 flex justify-center">
            <FaBoxOpen className="text-6xl" />
          </div>
          <p className="text-gray-500 text-lg">You haven't added any products yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const imageUrl = getImageUrl(product.image_url);
            
            return (
              <div
                key={product.ID}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100"
              >
                <div className="h-48 bg-gray-100 flex items-center justify-center relative">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.name_en}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center p-4">
                      <FaBoxOpen className="text-5xl mb-2" />
                      <span className="text-sm">No image available</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                      {product.name_en}
                    </h2>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        product.Status === "available"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.Status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-indigo-600 font-medium mb-3">
                    {product.category}
                  </p>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-700 text-sm flex items-center">
                      <FaBoxOpen className="mr-1 text-gray-500" />
                      {product.quantity} {product.unit || 'units'}
                    </span>
                    <span className="font-bold text-indigo-600 flex items-center">
                      <FaRupeeSign className="mr-1" />
                      {product.price_per_unit}/unit
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500 mb-4">
                    <span className="flex items-center">
                      <FaCalendarAlt className="mr-1" />
                      {new Date(product.available_from).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <FaCalendarAlt className="mr-1" />
                      {new Date(product.available_to).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link
                      to={`/products/edit/${product.ID}`}
                      className="flex-1 text-center bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg text-sm font-medium flex items-center justify-center"
                    >
                      <FaEdit className="mr-2" /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.ID)}
                      className="flex-1 text-center bg-red-50 hover:bg-red-100 text-red-700 py-2 rounded-lg text-sm font-medium flex items-center justify-center"
                    >
                      <FaTrash className="mr-2" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FarmerProductById;