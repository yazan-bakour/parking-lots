import { useLocation, Navigate } from "react-router-dom";
import { useAPI } from "../../apiContext";

export function RequireAuth({ children }) {
  const { loginUser } = useAPI();
  let location = useLocation();

  if (!loginUser) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}