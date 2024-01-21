import React, { useContext, createContext, useState } from "react";
import axios from "axios";
import createApiRequest from "./apiUtility";

const APIContext = createContext();
const BASE_URL = 'https://parkdemeer-afde952e3fef.herokuapp.com';

export function APIContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);
  const [spacesList, setSpacesList] = useState([]);
  const [sessionsList, setSessionsList] = useState([]);
  const [newSpacesList, setNewSpacesList] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const showErrorWithTimeout = (message, timeout = 3000) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, timeout);
  };
  const showSuccessWithTimeout = (message, timeout = 3000) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage('');
    }, timeout);
  };

  const storeAccessToken = (token) => {
    localStorage.setItem(`accessToken`, token);
  };

  const logoutUser = () => {
    localStorage.removeItem(`accessToken`);
  };

  const loginUser = () => {
    return localStorage.getItem(`accessToken`)
  }

  const userInfoResponse = async () => {
    try {
      const accessToken = loginUser()
      const info = await axios.get(`${BASE_URL}/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setUserInfo(info)
      showSuccessWithTimeout(`Welcome ${info.data.data.user.id}!`)
    } catch (error) {
      showErrorWithTimeout(error)
    }
  }

  const getSessionNewList = async (id) => {
    try {
      setLoading(true);
      await fetchSessionsList(0, 0, null, null, null, null, null, null, null);
      await new Promise((resolve) => setTimeout(resolve, 0));
      const updatedSessionsList = sessionsList?.data?.parkingSessions.filter(session => session.parkingSpaceId === id)
  
      let list = [];
      updatedSessionsList?.forEach((session) => {
        list.push({
          spaceType:
            session.parkingSpaceId === 1
              ? 'Residence'
              : session.parkingSpaceId === 2
              ? 'Non-residence Car'
              : 'Non-residence Motorbike',
          plateNumber: session.vehicleLicensePlate,
          vehicleType: session.vehicleType,
          parkingSessionId: session.parkingSessionId,
          minutes: session.sessionLengthInHoursMinutes
        });
      });
  
      return list;
    } catch (error) {
      showErrorWithTimeout(error)
    } finally {
      setLoading(false);
    }
  };

  const getAllMinutes = async (id) => {
    try {
      setLoading(true);
      const sessionsList = await getSessionNewList(id);
      const minutesArray = sessionsList.map((session) => session.minutes || 0);
      return minutesArray;
    } catch (error) {
      showErrorWithTimeout(error);
    } finally {
      setLoading(false);
    }
  };

  const postUserAuth = async (email, password) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/v1/auth/password`,
        {
          email,
          password
        },
        );
        const accessToken = data.data.auth.accessToken;
        storeAccessToken(accessToken);
        await userInfoResponse()
      return accessToken;
    } catch (error) {
      showErrorWithTimeout(error)
    }
  };

  const startParkingSession = async (vehicleType, isResident, vehicleLicensePlate) => {
    try {
      setLoading(true)
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
      showSuccessWithTimeout('New session started successfully!')
    } catch (error) {
      showErrorWithTimeout(error)
    } finally {
      setLoading(false)
    }
  };

  const endParkingSession = async (id) => {
    try {
      setLoading(true)
      const accessToken = loginUser();

      if (!accessToken) {
        throw new Error("User not authenticated");
      }

      const response = await axios.post(
        `${BASE_URL}/v1/parking/session/end`,
        {
          parkingSession: {
            id
          }
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      setNewSpacesList(response.data)
      showSuccessWithTimeout('Parking session ended successfully!')
    } catch (error) {
      showErrorWithTimeout(error)
    } finally {
      setLoading(false)
    }
  };

  const fetchSpacesList = async (offset, limit) => {
    try {
      setLoading(true)
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
      showErrorWithTimeout(error)
    } finally {
      setLoading(false)
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
      setLoading(true)
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
      return response.data;
    } catch (error) {
      showErrorWithTimeout(error)
    } finally {
      setLoading(false)
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
        endParkingSession,
        fetchSpacesList,
        newSpacesList,
        spacesList,
        errorMessage,
        fetchSessionsList,
        getSessionNewList,
        userInfoResponse,
        sessionsList,
        loading,
        successMessage,
        getAllMinutes
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