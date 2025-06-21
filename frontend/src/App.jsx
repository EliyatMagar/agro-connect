import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/LoginPage";
import Register from "./pages/SignupPage";

import FarmerDashboard from "./components/Dashboard/Farmer/FarmerDashboard";
import BuyerDashboard from "./components/Dashboard/Buyer/BuyerDashboard";
import TransporterDashboard from "./components/Dashboard/Transporter/TransporterDashboard";

import ProtectedRoute from "./components/ProtectedRoute"; // login & role check
import RoleProtectedRoute from "./components/RouteProtected/RoleProtectedRoute"; // profile existence check

import FarmerProfile from "./pages/Farmer/FarmerProfile";
import CreateFarmerProfile from "./pages/Farmer/CreateFarmerProfile";
import Update_farm from "./pages/Farmer/Update_Farm";
import AddProducts from "./components/Dashboard/Farmer/Products/AddProducts";
import ManageProducts from "./components/Dashboard/Farmer/Products/ManageProducts";
import EditProductById from "./components/Dashboard/Farmer/Products/EditProductById";
import FarmerProductById from "./components/Dashboard/Farmer/Products/FarmerProductById";

import TransporterProfile from "./pages/Transporter/TransporterProfile";
import BuyerProfile from "./pages/Buyer/BuyerProfile";
import CreateBuyerProfile from "./pages/Buyer/CreateBuyerProfile";

import NotFound from "./pages/NotFound";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";
import ProductsList from "./components/Products/ProductList/ProductsList";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/getallproducts" element={<ProductsList />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Farmer Routes */}
        <Route
          path="/create-farmer-profile"
          element={
            <ProtectedRoute allowedRoles={["farmer"]}>
              <CreateFarmerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer-profile"
          element={
            <RoleProtectedRoute allowedRoles={["farmer"]}>
              <FarmerProfile />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/update-farm"
          element={
            <RoleProtectedRoute allowedRoles={["farmer"]}>
              <Update_farm />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/farmer-dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["farmer"]}>
              <FarmerDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/products/addproductsByFarmer"
          element={
            <ProtectedRoute allowedRoles={["farmer"]}>
              <AddProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/manage"
          element={
            <ProtectedRoute allowedRoles={["farmer"]}>
              <ManageProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["farmer"]}>
              <EditProductById />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/productsDetailsById/:id"
          element={
            <ProtectedRoute allowedRoles={["farmer"]}>
              <FarmerProductById />
            </ProtectedRoute>
          }
        />

        {/* Buyer Routes */}
        <Route
          path="/buyer-dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["buyer"]}>
              <BuyerDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/buyer-profile"
          element={
            <RoleProtectedRoute allowedRoles={["buyer"]}>
              <BuyerProfile />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/create-buyer-profile"
          element={
            <ProtectedRoute allowedRoles={["buyer"]}>
              <CreateBuyerProfile />
            </ProtectedRoute>
          }
        />

        {/* Transporter Routes */}
        <Route
          path="/transporter-dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["transporter"]}>
              <TransporterDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/transporter-profile"
          element={
            <RoleProtectedRoute allowedRoles={["transporter"]}>
              <TransporterProfile />
            </RoleProtectedRoute>
          }
        />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
