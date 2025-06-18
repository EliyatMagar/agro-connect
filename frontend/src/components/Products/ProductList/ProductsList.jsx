import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBoxOpen, FaRupeeSign, FaCalendarAlt, FaSearch } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Standardized product categories
  const standardCategories = [
    "all",
    "vegetables",
    "fruits",
    "dairy",
    "meat",
    "grains",
    "spices",
    "beverages",
    "snacks",
    "others"
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/products/");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Function to construct proper image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    return `http://localhost:8080${imagePath.replace(/\\/g, '/')}`;
  };

  // Normalize category names for filtering
  const normalizeCategory = (category) => {
    if (!category) return "others";
    const lowerCaseCat = category.toLowerCase();
    
    if (lowerCaseCat.includes("vegetable")) return "vegetables";
    if (lowerCaseCat.includes("fruit")) return "fruits";
    if (lowerCaseCat.includes("dairy")) return "dairy";
    if (lowerCaseCat.includes("meat") || lowerCaseCat.includes("poultry")) return "meat";
    if (lowerCaseCat.includes("grain") || lowerCaseCat.includes("rice") || lowerCaseCat.includes("wheat")) return "grains";
    if (lowerCaseCat.includes("spice")) return "spices";
    if (lowerCaseCat.includes("beverage") || lowerCaseCat.includes("drink")) return "beverages";
    if (lowerCaseCat.includes("snack")) return "snacks";
    
    return standardCategories.includes(lowerCaseCat) ? lowerCaseCat : "others";
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name_en.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.name_np?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || 
                          normalizeCategory(product.category) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Format category name for display
  const formatCategoryName = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Our Products</h1>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Category Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {standardCategories.map(category => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : formatCategoryName(category)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4 flex justify-center">
            <FaBoxOpen className="text-6xl" />
          </div>
          <p className="text-gray-500 text-lg">No products found</p>
          <Link
            to="/products/add"
            className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Add New Product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const imageUrl = getImageUrl(product.image_url);
            const normalizedCategory = normalizeCategory(product.category);
            
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
                  
                  {product.name_np && (
                    <p className="text-gray-600 text-sm mb-2 line-clamp-1">{product.name_np}</p>
                  )}
                  
                  <p className="text-sm text-indigo-600 font-medium mb-3">
                    {formatCategoryName(normalizedCategory)}
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
                  
                  <Link
                    to={`/products/${product.ID}`}
                    className="block w-full text-center bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductsList;