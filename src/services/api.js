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

// Get all resumes uploaded by the logged-in user
export const getMyResumes = () => {
  return API.get("/resumes/My-resumes");
};

// Analyze a resume against a job description
// resumeId: which resume to analyze
// jobDescription: the job posting text
// templateType: "service", "product", or "hybrid"
export const analyzeResume = (resumeId, jobDescription, templateType) => {
  return API.post(`/resumes/${resumeId}`, { jobDescription, templateType });
};

export const downloadResume = (reportId) => {
  return API.get(`/resumes/generate/${reportId}`, {
    responseType: "blob",
  });
};