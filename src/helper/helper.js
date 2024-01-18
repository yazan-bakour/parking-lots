import { useLocation, Navigate } from "react-router-dom";
import { useAPI } from "../apiContext";

export function RequireAuth({ children }) {
  const { loginUser } = useAPI();
  let location = useLocation();

  if (!loginUser()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export const navigationManager = (location, user) => {
  const pageLocation = location?.pathname.split("/")[1];
  
  if (!pageLocation) {
    return null
  }
  let headerText = [];

  //TODO ADD DYNAMIC HEADER NAV NAMES BASED ON USER AUTH

  return headerText;
};

