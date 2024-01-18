import React, { useContext, createContext } from "react";
import axios from "axios";

const APIContext = createContext();

export function APIContextProvider({ children }) {

  const storeAccessToken = (token) => {
    localStorage.setItem("accessToken", token);
  };

  const logoutUser = () => {
    localStorage.removeItem("accessToken");
    console.log("User logged out");
  };

  const loginUser = () => {
    return localStorage.getItem("accessToken")
  }

  const postUserAuth = async (email, password) => {
    try {
      const { data } = await axios.post(
        'https://parkdemeer-afde952e3fef.herokuapp.com/v1/auth/password',
        {
          email,
          password
        }
      );
      const accessToken = data.data.auth.accessToken;
      storeAccessToken(accessToken);
      //ADD TOAST SUCCESS MESSAGE
      return accessToken;
    } catch (error) {
      //ADD TOAST FAIL MESSAGE
      throw error;
    }
  };

  return (
    <APIContext.Provider
      value={{
        postUserAuth,
        logoutUser,
        loginUser
      }}
    >
      {children}
    </APIContext.Provider>
  );
}

export function useAPI() {
  const context = useContext(APIContext);
  if (context === undefined) {
    throw new Error("Context must be used within a Provider");
  }
  return context;
}
