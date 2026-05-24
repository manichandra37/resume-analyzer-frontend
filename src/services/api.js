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
