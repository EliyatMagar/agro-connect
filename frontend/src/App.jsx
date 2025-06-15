import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/LoginPage";
import Register from "./pages/SignupPage";

import FarmerDashboard from "./components/dashboard/FarmerDashboard";
import BuyerDashboard from "./components/dashboard/BuyerDashboard";
import TransporterDashboard from "./components/dashboard/TransporterDashboard";

import ProtectedRoute from "./components/ProtectedRoute"; // general login + role check
import FarmerProtectedRoute from "./components/RouteProtected/FarmerProtectedRoute"; // checks profile

import FarmerProfile from "./pages/Farmer/FarmerProfile";
import CreateFarmerProfile from "./pages/Farmer/CreateFarmerProfile";
import Update_farm from "./pages/Farmer/Update_Farm"

import TransporterProfile from "./pages/Transporter/TransporterProfile";
import BuyerProfile from "./pages/Buyer/BuyerProfile";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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
            <FarmerProtectedRoute>
              <FarmerProfile />
            </FarmerProtectedRoute>
          }
        />
        <Route
          path="/update-farm"
          element={
            <FarmerProtectedRoute>
              <Update_farm />
            </FarmerProtectedRoute>
          }
        />
        <Route
          path="/farmer-dashboard"
          element={
            <FarmerProtectedRoute>
              <FarmerDashboard />
            </FarmerProtectedRoute>
          }
        />

        {/* Buyer Routes */}
        <Route
          path="/buyer-dashboard"
          element={
            <ProtectedRoute allowedRoles={["buyer"]}>
              <BuyerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buyer-profile"
          element={
            <ProtectedRoute allowedRoles={["buyer"]}>
              <BuyerProfile />
            </ProtectedRoute>
          }
        />

        {/* Transporter Routes */}
        <Route
          path="/transporter-dashboard"
          element={
            <ProtectedRoute allowedRoles={["transporter"]}>
              <TransporterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transporter-profile"
          element={
            <ProtectedRoute allowedRoles={["transporter"]}>
              <TransporterProfile />
            </ProtectedRoute>
          }
        />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
