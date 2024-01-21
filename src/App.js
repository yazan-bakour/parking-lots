import { Routes, Route } from "react-router-dom";
import { useAPI } from "./api/apiContext";
import Layout from "./common/layout/Layout";
import Overview from "./components/overview/Overview";
import Login from "./components/login/Login";
import Sessions from "./components/sessions/Sessions";
import React, { useEffect, useState } from "react";
import { RequireAuth } from "./helper/helper"
import { useNavigate, useLocation } from "react-router-dom";
import './App.css';

function App() {
  const { loginUser, errorMessage, userInfoResponse } = useAPI()
  const [isCheckingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate()
  let location = useLocation();

  useEffect(() => {
    userInfoResponse();
    const checkAuthStatus = async () => {
      try {
        const accessToken = loginUser();
        if (accessToken && errorMessage?.response?.status !== 401) {
          setCheckingAuth(false);
          if (location.pathname === "/login") {
            navigate("/overview", { state: { from: location }, replace: true })
          }
        } else {
          setCheckingAuth(false);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setCheckingAuth(false);
      }
    };

    
    checkAuthStatus();
  }, []);

  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/overview" element={ <RequireAuth><Overview /></RequireAuth> }/>
        <Route path="/sessions" element={ <RequireAuth><Sessions /></RequireAuth> }/>
        {/* <Route path="/finance" element={ <RequireAuth><Finance /></RequireAuth> }/> */}
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  );
}

export default App;
