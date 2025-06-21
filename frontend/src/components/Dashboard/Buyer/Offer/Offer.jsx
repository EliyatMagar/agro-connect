import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Offer = () => {
  const [offers, setOffers] = useState([]);
  const [offer, setOffer] = useState({
    product_id: "",
    quantity: 0,
    price: 0,
    pickup_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({ status: "PENDING" });
  const { id } = useParams();
  const navigate = useNavigate();

  // Get auth token from local storage
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // Set up axios instance with base URL and auth header
  const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Fetch all offers
  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/offers/");
      setOffers(response.data.offers);
    } catch (error) {
      toast.error("Failed to fetch offers");
    } finally {
      setLoading(false);
    }
  };

  // Fetch single offer
  const fetchOffer = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/offers/${id}`);
      setOffer(response.data.offer);
    } catch (error) {
      toast.error("Failed to fetch offer");
      navigate("/offers/");
    } finally {
      setLoading(false);
    }
  };

  // Create new offer
  const createOffer = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/offers/", offer);
      toast.success("Offer created successfully");
      navigate("/offers");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create offer");
    } finally {
      setLoading(false);
    }
  };

  // Update offer
  const updateOffer = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.put(`/offers/${id}`, offer);
      toast.success("Offer updated successfully");
      navigate("/buyer-dashboard");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update offer");
    } finally {
      setLoading(false);
    }
  };

  // Update offer status
  const updateOfferStatus = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.patch(`/offers/${id}/status`, statusUpdate);
      toast.success("Offer status updated successfully");
      fetchOffer(id); // Refresh offer data
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  // Delete offer
  const deleteOffer = async () => {
    try {
      setLoading(true);
      await api.delete(`/offers/${id}`);
      toast.success("Offer deleted successfully");
      navigate("/offers");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete offer");
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOffer((prev) => ({ ...prev, [name]: value }));
  };

  // Handle status change
  const handleStatusChange = (e) => {
    setStatusUpdate({ status: e.target.value });
  };

  useEffect(() => {
    if (id) {
      fetchOffer(id);
    } else {
      fetchOffers();
    }
  }, [id]);

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {!id ? (
        <>
          <h1 className="text-2xl font-bold mb-6">All Offers</h1>
          {userRole === "buyer" && (
            <button
              onClick={() => navigate("/offers/new")}
              className="bg-green-600 text-white px-4 py-2 rounded mb-4"
            >
              Create New Offer
            </button>
          )}
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Product</th>
                  <th className="py-2 px-4 border">Quantity</th>
                  <th className="py-2 px-4 border">Price</th>
                  <th className="py-2 px-4 border">Status</th>
                  <th className="py-2 px-4 border">Pickup Date</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr key={offer.ID} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border">{offer.product_id}</td>
                    <td className="py-2 px-4 border">{offer.quantity}</td>
                    <td className="py-2 px-4 border">${offer.price}</td>
                    <td className="py-2 px-4 border">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        offer.status === "ACCEPTED" ? "bg-green-100 text-green-800" :
                        offer.status === "REJECTED" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {offer.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 border">{offer.pickup_date}</td>
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() => navigate(`/offers/${offer.ID}`)}
                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                      >
                        View
                      </button>
                      {(userRole === "buyer" || userRole === "admin") && (
                        <button
                          onClick={() => deleteOffer(offer.ID)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-6">
            {id === "new" ? "Create New Offer" : "Offer Details"}
          </h1>

          <form onSubmit={id === "new" ? createOffer : updateOffer} className="max-w-lg">
            <div className="mb-4">
              <label className="block mb-2">Product ID</label>
              <input
                type="text"
                name="product_id"
                value={offer.product_id}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                disabled={id !== "new"}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={offer.quantity}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                step="0.01"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Price</label>
              <input
                type="number"
                name="price"
                value={offer.price}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                step="0.01"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Pickup Date</label>
              <input
                type="date"
                name="pickup_date"
                value={offer.pickup_date}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {id === "new" ? "Create Offer" : "Update Offer"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/offers")}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>

          {id !== "new" && (userRole === "farmer" || userRole === "admin") && (
            <div className="mt-8 max-w-lg">
              <h2 className="text-xl font-bold mb-4">Update Offer Status</h2>
              <form onSubmit={updateOfferStatus} className="flex items-end space-x-4">
                <div className="flex-1">
                  <label className="block mb-2">Status</label>
                  <select
                    value={statusUpdate.status}
                    onChange={handleStatusChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Update Status
                </button>
              </form>
            </div>
          )}

          {id !== "new" && (userRole === "buyer" || userRole === "admin") && (
            <div className="mt-8">
              <button
                onClick={deleteOffer}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete Offer
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Offer;