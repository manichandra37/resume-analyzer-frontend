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

API.interceptors.request.use((config) => {
  // Don't attach token to login/register requests
  if (!config.url.includes("/auth/")) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Uploads a resume file to the backend
// FormData is a browser API that lets you send files over HTTP
// "multipart/form-data" tells the server "this request contains a file, not JSON"
export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post("/resumes/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
