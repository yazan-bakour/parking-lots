import React, { useContext, createContext, useState } from "react";
import axios from "axios";

const APIContext = createContext();
const BASE_URL = 'https://parkdemeer-afde952e3fef.herokuapp.com';

export function APIContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);
  const [spacesList, setSpacesList] = useState([]);
  const [sessionsList, setSessionsList] = useState([]);
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

  const userAuth = () => {
    return userInfo
  }

  const userInfoResponse = async () => {
    try {
      const accessToken = loginUser()
      const info = await axios.get(`${BASE_URL}/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setErrorMessage('')
      setUserInfo(info)
    } catch (error) {
      setErrorMessage(error.message)
    }
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
      userInfoResponse()
      storeAccessToken(accessToken);
      setErrorMessage('')
      return accessToken;
    } catch (error) {
      //ADD TOAST FAIL MESSAGE
      setErrorMessage(error.message)
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
      setErrorMessage('')
      setNewSpacesList(response.data)
    } catch (error) {
      setErrorMessage(error.message)
    }
  };

  const fetchSpacesList = async (offset, limit) => {
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
      setErrorMessage('')
      setSpacesList(response.data.data);
    } catch (error) {
      setErrorMessage(error.message)
    }
  };

  const fetchSessionsList = async (
    offset,
    limit,
    isSessionEnded,
    sessionStartedAtFrom,
    sessionStartedAtTo,
    sessionEndedAtFrom,
    sessionEndedAtTo,
    vehicleLicensePlate,
    vehicleType
  ) => {
    try {
      const accessToken = loginUser();

      if (!accessToken) {
        throw new Error("User not authenticated");
      }
      const response = await axios.get(
        `${BASE_URL}/v1/parking/sessions/list`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          params: {
            offset,
            limit,
            isSessionEnded,
            sessionStartedAtFrom,
            sessionStartedAtTo,
            sessionEndedAtFrom,
            sessionEndedAtTo,
            vehicleLicensePlate,
            vehicleType,
          },
        }
      );
      setSessionsList(response.data)
      console.log("Sessions list fetched:", response.data);
      return response.data;
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
        errorMessage,
        fetchSessionsList,
        userInfoResponse,
        sessionsList
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
