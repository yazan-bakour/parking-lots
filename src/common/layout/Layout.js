import { Outlet, NavLink } from "react-router-dom";
import { useAPI } from "../../apiContext";
import './Layout.css'

const Layout = () => {
  const { logoutUser, loginUser, errorMessage } = useAPI();
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
      <div className="header">
        <div className="main-nav">
          <NavLink to={`/overview`} >
            <p>Overview</p>
          </NavLink>

          <NavLink to={`/sessions`} >
            <p>Sessions</p>
          </NavLink>
        </div>

        <NavLink to={`/login`} onClick={handleUserEvent} >
          <p>{loginUser() ? 'Logout' : 'Login'}</p>
        </NavLink>
      </div>
      {errorMessage && <div className="error">{errorMessage}, please login again</div>}

      <div className="bodyLaout"><Outlet /></div>

    </div>
  );
};

export default Layout;