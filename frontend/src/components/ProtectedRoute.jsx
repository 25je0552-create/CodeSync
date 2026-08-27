import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function ProtectedRoute({ children }) {
  const hasLocalUser = Boolean(
    localStorage.getItem("username") || localStorage.getItem("userId")
  );

  const [loading, setLoading] = useState(!hasLocalUser);
  const [authenticated, setAuthenticated] = useState(hasLocalUser);

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
          // If neither cookie nor localStorage is valid, unauthenticate
          if (!localStorage.getItem("username") && !localStorage.getItem("userId")) {
            setAuthenticated(false);
          }
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