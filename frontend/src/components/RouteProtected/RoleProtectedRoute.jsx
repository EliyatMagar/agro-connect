import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : null;
  const role = decodedToken?.role || decodedToken?.Role; // Handle both case variations

  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  const profileEndpoints = {
    farmer: "http://localhost:8080/farmer-profile/",
    buyer: "http://localhost:8080/buyer-profile/me",
    transporter: "http://localhost:8080/transporter-profile/me",
  };

  const profileCreationRoutes = {
    farmer: "/create-farmer-profile",
    buyer: "/create-buyer-profile",
    transporter: "/create-transporter-profile",
  };

  useEffect(() => {
    if (!allowedRoles?.includes(role)) {
      setLoading(false);
      return;
    }

    const checkProfile = async () => {
      try {
        const endpoint = profileEndpoints[role];
        if (!endpoint) throw new Error("Invalid role");

        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Updated profile check logic based on your API responses
        if (res.data.profile) { // For single profile responses
          setHasProfile(true);
        } else if (res.data.profiles?.length > 0) { // For array responses
          const profileExists = res.data.profiles.some(p => p.user_id === user?.id);
          setHasProfile(profileExists);
        } else {
          setHasProfile(false);
        }
      } catch (err) {
        console.error("Error checking profile:", err);
        setHasProfile(false);
      } finally {
        setLoading(false);
      }
    };

    checkProfile();
  }, [role, token, user?.id, allowedRoles]);

  if (loading) return <div>Loading...</div>;

  if (!role || !allowedRoles?.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  if (!hasProfile) {
    return <Navigate to={profileCreationRoutes[role]} replace />;
  }

  return children;
};

export default RoleProtectedRoute;