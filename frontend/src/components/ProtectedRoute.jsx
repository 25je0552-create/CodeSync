import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function ProtectedRoute({ children }) {

  const [loading, setLoading] =
    useState(true);

  const [authenticated,
    setAuthenticated] =
    useState(false);

  useEffect(() => {

    const verifyUser =
      async () => {

      try {

        await axios.get(
          "http://localhost:5000/api/auth/verify",
          {
            withCredentials: true,
          }
        );

        setAuthenticated(true);

      } catch {

        setAuthenticated(false);

      }

      setLoading(false);

    };

    verifyUser();

  }, []);

  if (loading)
    return <div>Loading...</div>;

  return authenticated
    ? children
    : <Navigate to="/login" />;
}

export default ProtectedRoute;