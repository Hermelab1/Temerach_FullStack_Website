import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4001/api",
});

export const login = async (credentials) => {
  const { data } = await API.post('/login', credentials);
  return data;
};

export const register = async (userData) => {
  const { data } = await API.post('/register', userData);
  return data;
};