import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const FarmerProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const res = await axios.get("http://localhost:8080/farmer-profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const profile = res.data.profiles.find(
          (p) => p.user_id === user?.id
        );

        setHasProfile(!!profile);
      } catch (err) {
        console.error("Error checking farmer profile", err);
      } finally {
        setLoading(false);
      }
    };

    checkProfile();
  }, []);

  if (loading) return <div>Loading...</div>;

  // Redirect to profile creation if no profile found
  if (!hasProfile) {
    return <Navigate to="/create-farmer-profile" replace />;
  }

  return children;
};

export default FarmerProtectedRoute;
