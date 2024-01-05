import axios from 'axios';

// For Developement Purposes
const BASE_URL = 'http://localhost:8000/api/v1';

export const fetchData = async (path) => {
  try {
    const url = BASE_URL + path;

    const response = await axios.get(url);

    return response;
  } catch (error) {
    throw new Error(`Error occurred in api.js::fetchData() :: ${error}`);
  }
};
