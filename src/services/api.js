import axios from 'axios';

const API_BASE = 'http://localhost:8088/api';

export const getAllRutes = async () => {
  const response = await axios.get(`${API_BASE}/rutes`);
  return response.data;
};

export const getRuteById = async (id) => {
  const response = await axios.get(`${API_BASE}/rutes/${id}`);
  return response.data;
};
