import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const verifyUser = async () => {
      try {
        await axios.get("http://localhost:5000/api/auth/verify", {
          withCredentials: true,
        });

        if (isMounted) {
          setAuthenticated(true);
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          localStorage.removeItem("username");
          localStorage.removeItem("userId");
          setAuthenticated(false);
          setLoading(false);
        }
      }
    };

    verifyUser();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#000000] font-bugatti-mono text-[#999999] text-xs uppercase tracking-[2.5px]">
        AUTHENTICATING ACCESS...
      </div>
    );
  }

  return authenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;