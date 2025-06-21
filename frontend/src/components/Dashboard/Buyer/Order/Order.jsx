import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const Order = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState({
    offer_id: '',
    product_id: '',
    status: 'processing',
    quantity: 1,
    notes: ''
  });
  const [filter, setFilter] = useState({
    status: '',
    product_id: ''
  });

  // Get auth token
  const token = localStorage.getItem('token');
  
  // Axios instance with auth header
  const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Show alert message
  const showAlert = (message, isError = false) => {
    alert(`${isError ? 'Error: ' : ''}${message}`);
  };

  // Fetch orders or single order
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (id) {
          // Fetch single order
          const response = await api.get(`/orders/${id}`);
          setOrder(response.data.data);
        } else {
          // Fetch all orders with filters
          let url = '/orders';
          const params = new URLSearchParams();
          if (filter.status) params.append('status', filter.status);
          if (filter.product_id) params.append('product_id', filter.product_id);
          if (params.toString()) url += `?${params.toString()}`;
          
          const response = await api.get(url);
          setOrders(response.data.data);
        }
      } catch (error) {
        showAlert(error.response?.data?.error || 'Failed to fetch orders', true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, filter]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrder({ ...order, [name]: value });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await api.put(`/orders/${id}`, order);
        showAlert('Order updated successfully');
      } else {
        await api.post('/orders', order);
        showAlert('Order created successfully');
      }
      navigate('/orders');
    } catch (error) {
      showAlert(error.response?.data?.error || 'Failed to save order', true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setLoading(true);
      try {
        await api.delete(`/orders/${id}`);
        showAlert('Order deleted successfully');
        navigate('/orders');
      } catch (error) {
        showAlert(error.response?.data?.error || 'Failed to delete order', true);
      } finally {
        setLoading(false);
      }
    }
  };

  const updateStatus = async (status) => {
    setLoading(true);
    try {
      await api.patch(`/orders/${id}/status`, { status });
      setOrder({ ...order, status });
      showAlert(`Order status updated to ${status}`);
    } catch (error) {
      showAlert(error.response?.data?.error || 'Failed to update status', true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {id ? (
        // Order Detail/Edit View
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">
            {id ? 'Order Details' : 'Create New Order'}
          </h1>
          
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Product ID
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                name="product_id"
                value={order.product_id}
                onChange={handleInputChange}
                required
                disabled={!!id}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Offer ID
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                name="offer_id"
                value={order.offer_id}
                onChange={handleInputChange}
                required
                disabled={!!id}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Quantity
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="number"
                name="quantity"
                min="1"
                value={order.quantity}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Status
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="status"
                value={order.status}
                onChange={handleInputChange}
                disabled={!id} // Only allow status change in edit mode
              >
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Notes
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="notes"
                value={order.notes}
                onChange={handleInputChange}
                rows="3"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Order'}
              </button>
              
              {id && (
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Delete Order'}
                </button>
              )}
            </div>
          </form>
          
          {id && (
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="flex space-x-2">
                {order.status !== 'completed' && (
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => updateStatus('completed')}
                  >
                    Mark as Completed
                  </button>
                )}
                {order.status !== 'canceled' && (
                  <button
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => updateStatus('canceled')}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        // Orders List View
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Your Orders</h1>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => navigate('/orders/new')}
            >
              Create New Order
            </button>
          </div>
          
          {/* Filters */}
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Status
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  name="status"
                  value={filter.status}
                  onChange={handleFilterChange}
                >
                  <option value="">All Statuses</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Product ID
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  name="product_id"
                  value={filter.product_id}
                  onChange={handleFilterChange}
                  placeholder="Filter by product"
                />
              </div>
              
              <div className="flex items-end">
                <button
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => setFilter({ status: '', product_id: '' })}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
          
          {/* Orders Table */}
          <div className="bg-white shadow-md rounded overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.ID} className="hover:bg-gray-50">
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        #{order.ID}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {order.product_id}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status === 'completed' 
                            ? 'bg-green-200 text-green-800' 
                            : order.status === 'canceled' 
                              ? 'bg-red-200 text-red-800' 
                              : 'bg-yellow-200 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        {new Date(order.CreatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 text-sm">
                        <button
                          className="text-blue-500 hover:text-blue-800"
                          onClick={() => navigate(`/orders/${order.ID}`)}
                        >
                          View/Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-5 py-5 border-b border-gray-200 text-center text-sm">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;