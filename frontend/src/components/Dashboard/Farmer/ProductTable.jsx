import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaEdit, FaTrash, FaSearch, FaFilter, FaSort, FaTimes } from 'react-icons/fa';
import Pagination from './Pagination';

const ProductTable = ({ 
  products, 
  handleDelete, 
  loading,
  onSearch,
  onSort,
  onFilter
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  
  // Extract unique categories from products
  const categories = [...new Set(products.map(product => product.category))].filter(Boolean);

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (onSearch) onSearch(term);
  };

  // Handle sort
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    if (onSort) onSort(key, direction);
  };

  // Toggle category selection
  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Clear all selected categories
  const clearCategories = () => {
    setSelectedCategories([]);
  };

  // Filter products by selected categories
  const filteredProducts = selectedCategories.length > 0
    ? products.filter(product => selectedCategories.includes(product.category))
    : products;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, searchTerm]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FaBox className="mx-auto text-4xl mb-2" />
        <p>You haven't added any products yet</p>
        <Link
          to="/products/addproductsByFarmer"
          className="mt-4 inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Add Your First Product
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden border border-green-100">
      {/* Table Controls */}
      <div className="p-4 border-b border-green-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400" />
          <input
            type="text"
            placeholder="Search crops or produce..."
            className="pl-10 pr-4 py-2 border border-green-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-300"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="flex space-x-2 w-full sm:w-auto">
          <div className="relative">
            <button 
              onClick={() => setShowCategoryFilter(!showCategoryFilter)}
              className="flex items-center px-3 py-2 border border-green-200 rounded-lg text-sm font-medium hover:bg-green-50 text-green-700"
            >
              <FaFilter className="mr-2" /> 
              {selectedCategories.length > 0 ? (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  {selectedCategories.length}
                </span>
              ) : (
                'Filter'
              )}
            </button>
            
            {showCategoryFilter && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-green-200 z-10">
                <div className="p-3 border-b border-green-200 flex justify-between items-center">
                  <h3 className="text-sm font-medium text-green-800">Filter by Category</h3>
                  <button 
                    onClick={clearCategories}
                    className="text-xs text-green-600 hover:text-green-800"
                  >
                    Clear all
                  </button>
                </div>
                <div className="p-2 max-h-60 overflow-y-auto">
                  {categories.map(category => (
                    <div key={category} className="flex items-center p-2 hover:bg-green-50 rounded">
                      <input
                        type="checkbox"
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="h-4 w-4 text-green-600 border-green-300 rounded focus:ring-green-500"
                      />
                      <label 
                        htmlFor={`category-${category}`}
                        className="ml-2 text-sm text-green-700 capitalize"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected categories chips */}
      {selectedCategories.length > 0 && (
        <div className="px-4 py-2 bg-green-50 border-b border-green-200 flex flex-wrap gap-2">
          {selectedCategories.map(category => (
            <span 
              key={category}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize"
            >
              {category}
              <button 
                onClick={() => toggleCategory(category)}
                className="ml-1 text-green-600 hover:text-green-800"
              >
                <FaTimes className="text-xs" />
              </button>
            </span>
          ))}
          <button 
            onClick={clearCategories}
            className="ml-auto text-xs text-green-600 hover:text-green-800 flex items-center"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-green-200">
          <thead className="bg-green-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('name_en')}
              >
                <div className="flex items-center">
                  Product
                  <FaSort className="ml-1 text-xs" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('category')}
              >
                <div className="flex items-center">
                  Category
                  <FaSort className="ml-1 text-xs" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('price_per_unit')}
              >
                <div className="flex items-center">
                  Price
                  <FaSort className="ml-1 text-xs" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('quantity')}
              >
                <div className="flex items-center">
                  Stock
                  <FaSort className="ml-1 text-xs" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-green-200">
            {currentItems.map((product) => (
              <tr key={product.ID} className="hover:bg-green-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {product.image_url ? (
                      <div className="flex-shrink-0 h-10 w-10">
                        <img 
                          className="h-10 w-10 rounded-full object-cover" 
                          src={`http://localhost:8080${product.image_url.replace(/\\/g, '/')}`} 
                          alt={product.name_en}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/40';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                        <FaBox className="text-green-400" />
                      </div>
                    )}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-green-900">{product.name_en}</div>
                      {product.name_np && (
                        <div className="text-sm text-green-600">{product.name_np}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 capitalize">
                  {product.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                  Rs. {product.price_per_unit.toLocaleString()}/unit
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                  {product.quantity} {product.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.Status === "available" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {product.Status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    to={`/products/edit/${product.ID}`}
                    className="text-green-600 hover:text-green-900 mr-4 inline-flex items-center"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.ID)}
                    className="text-amber-600 hover:text-amber-900 inline-flex items-center"
                  >
                    <FaTrash className="mr-1" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-green-200 bg-green-50">
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default ProductTable;