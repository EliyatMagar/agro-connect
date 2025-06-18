import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  FaBox, FaPlusCircle, FaChartLine, FaUserCog, 
  FaHome, FaSearch, FaEdit, FaTrash, FaBars, FaTimes 
} from 'react-icons/fa';
import axios from 'axios';

import ProductTable from "./ProductTable"
import DashboardHeader from "./DashboardHeader"
import Sidebar from "./Sidebar"
import StatsCard from "./StatsCard"

// Main Dashboard Component
const FarmerDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/products/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.filter(product => product.ID !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const filteredProducts = products.filter(product => 
    product.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.name_np?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-green-50">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-green-800">Dashboard Overview</h1>
            <p className="text-green-600">Welcome back! Here's what's happening with your farm products.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatsCard 
              title="Total Products" 
              value={products.length} 
              icon={<FaBox />} 
              color="bg-gradient-to-r from-green-50 to-green-100" 
            />
            <StatsCard 
              title="Available" 
              value={products.filter(p => p.Status === 'available').length} 
              icon={<FaBox />} 
              color="bg-gradient-to-r from-lime-50 to-lime-100" 
            />
            <StatsCard 
              title="Out of Stock" 
              value={products.filter(p => p.Status !== 'available').length} 
              icon={<FaBox />} 
              color="bg-gradient-to-r from-amber-50 to-amber-100" 
            />
            <StatsCard 
              title="Categories" 
              value={new Set(products.map(p => p.category)).size} 
              icon={<FaBox />} 
              color="bg-gradient-to-r from-teal-50 to-teal-100" 
            />
          </div>

          {/* Products Section */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
              <h2 className="text-xl font-semibold text-green-800">Your Products</h2>
              <div className="relative w-full md:w-64">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 border border-green-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <ProductTable 
              products={filteredProducts} 
              handleDelete={handleDelete} 
              loading={loading} 
            />
          </div>

          {/* Recent Activity or other sections can be added here */}
        </main>
      </div>
    </div>
  );
};

export default FarmerDashboard;