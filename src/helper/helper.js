import { useLocation, Navigate } from "react-router-dom";
import { useAPI } from "../api/apiContext";

export function RequireAuth({ children }) {
  const { loginUser } = useAPI();
  let location = useLocation();

  if (!loginUser()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export function formatNumber(number) {
  return number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
}

export function convertDate(date)  {
  return new Date(date).toISOString().slice(0, 16)
}
