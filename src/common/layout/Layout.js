import { Outlet, NavLink } from "react-router-dom";
import { useAPI } from "../../api/apiContext";
import './Layout.css'
import Errors from "../error/Errors";

const Layout = () => {
  const { logoutUser, loginUser, errorMessage, successMessage } = useAPI();
  const handleUserEvent = () => {
    const userLoggedIn = loginUser()
    if (userLoggedIn) {
      logoutUser()
    } else {
      return null
    }
  }

  return (
    <div className="main">
      <div className="header b-d-blue">
        <div className="main-nav t-white">
          <NavLink 
            to={`/overview`} 
            className={({ isActive }) =>
              isActive ? "t-white" : "t-pending"
            }>
            <p>Overview</p>
          </NavLink>

          <NavLink 
            to={`/sessions`} 
            className={({ isActive }) =>
              isActive ? "t-white" : "t-pending"
            } 
          >
            <p>Sessions</p>
          </NavLink>

          {/* <NavLink 
            to={`/finance`} 
            className={({ isActive }) =>
              isActive ? "t-white" : "t-pending"
            } 
          >
            <p>Finance</p>
          </NavLink> */}
        </div>

        <NavLink 
          to={`/login`} 
          onClick={handleUserEvent} 
          className={({ isActive }) =>
            isActive ? "t-white" : "t-pending"
          } 
        >
          <p>{loginUser() ? 'Logout' : 'Login'}</p>
        </NavLink>
      </div>
      {errorMessage && <div className="message error">{errorMessage.response?.data.status.message}</div>}
      {successMessage && <div className="message success">{successMessage}</div>}

      <div className="bodyLaout">
        <Outlet />
      </div>

    </div>
  );
};

export default Layout;