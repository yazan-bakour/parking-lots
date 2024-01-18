import { Routes, Route } from "react-router-dom";
import { useAPI } from "./apiContext";
import Layout from "./common/layout/Layout";
import Overview from "./components/overview/Overview";
import Login from "./components/login/Login";
// import Sessions from "./components/sessions/Sessions";
import React, { useEffect, useState } from "react";
import { RequireAuth } from "./helper/helper"
import './App.css';

function App() {
  const { loginUser } = useAPI()
  const [isCheckingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const accessToken = loginUser();
        if (accessToken) {
          setCheckingAuth(false);
        } else {
          setCheckingAuth(false);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, [loginUser]);

  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/overview" element={ <RequireAuth><Overview /></RequireAuth> }/>
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  );
}

export default App;
