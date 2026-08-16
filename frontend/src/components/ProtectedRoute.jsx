import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        await axios.get("http://localhost:5000/api/auth/verify", {
          withCredentials: true,
        });

        setAuthenticated(true);
      } catch {
        setAuthenticated(false);
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#000000] font-bugatti-mono text-[#999999] text-xs uppercase tracking-[2.5px]">
        AUTHENTICATING ACCESS...
      </div>
    );
  }

  return authenticated ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;