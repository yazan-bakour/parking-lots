import axios from "axios";

const BASE_URL = 'https://parkdemeer-afde952e3fef.herokuapp.com';

const createApiRequest = async (endpoint, method = 'get', data = {}) => {
  const accessToken = localStorage.getItem(`accessToken`);
  
  if (!accessToken) {
    return Promise.reject({
      message: 'User not authenticated',
      unauthorized: true,  // Add a flag to identify unauthorized errors
    });
  }

  try {
    const response = await axios({
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      ...((method === 'get' || method === 'delete') && { params: data }),
      ...((method === 'post' || method === 'put') && { data }),
    });

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export default createApiRequest;
