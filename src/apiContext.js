import React, { useContext, createContext, useState } from "react";
import axios from "axios";

const APIContext = createContext();
const BASE_URL = 'https://parkdemeer-afde952e3fef.herokuapp.com';

export function APIContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);
  const [spacesList, setSpacesList] = useState([]);
  const [newSpacesList, setNewSpacesList] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const storeAccessToken = (token) => {
    localStorage.setItem(`accessToken`, token);
  };

  const logoutUser = () => {
    localStorage.removeItem(`accessToken`);
    setErrorMessage('')
  };

  const loginUser = () => {
    return localStorage.getItem(`accessToken`)
  }

  const postUserAuth = async (email, password) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/v1/auth/password`,
        {
          email,
          password
        }
      );
      const accessToken = data.data.auth.accessToken;

      const userInfoResponse = await axios.get(`${BASE_URL}/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setUserInfo(userInfoResponse.data);

      storeAccessToken(accessToken);
      //ADD TOAST SUCCESS MESSAGE
      return accessToken;
    } catch (error) {
      //ADD TOAST FAIL MESSAGE
      throw error;
    }
  };

  const startParkingSession = async (vehicleType, isResident, vehicleLicensePlate) => {
    try {
      const accessToken = loginUser();

      if (!accessToken) {
        throw new Error("User not authenticated");
      }

      const response = await axios.post(
        `${BASE_URL}/v1/parking/session/start`,
        {
          parkingSession: {
            vehicleType,
            isResident,
            vehicleLicensePlate,
          }
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      setNewSpacesList(response.data)
    } catch (error) {
      setErrorMessage(error.message)
    }
  };

  const fetchSpacesList = async (offset = 0, limit = 20) => {
    try {
      const accessToken = loginUser();

      if (!accessToken) {
        throw new Error("User not authenticated");
      }

      const response = await axios.get(
        `${BASE_URL}/v1/parking/spaces/list`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          params: {
            offset,
            limit,
          }
        }
      );
      setSpacesList(response.data.data);

    } catch (error) {
      setErrorMessage(error.message)
    }
  };

  return (
    <APIContext.Provider
      value={{
        postUserAuth,
        logoutUser,
        loginUser,
        userInfo,
        startParkingSession,
        fetchSpacesList,
        newSpacesList,
        spacesList,
        errorMessage
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
