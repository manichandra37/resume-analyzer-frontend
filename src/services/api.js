import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

export const loginUser = (email, password) => {
  return API.post("/auth/login", { email, password });
};

export const registerUser = (name, email, password, phoneNumber) => {
  return API.post("/auth/register", { name, email, password, phoneNumber });
};


// This runs before every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});