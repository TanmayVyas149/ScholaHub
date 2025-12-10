import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, authenticated } = useContext(AuthContext);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(true);
  }, []);

  
  if (!checked) return null;

  
  if (!authenticated) return <Navigate to="/login" replace />;

    if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Allow access
  return children;
}
