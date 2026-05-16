import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getAllNews = (category = "All") =>
  api.get("/news", { params: { category } });
export const getArticleById = (id) => api.get(`/news/${id}`);
export const fetchLatest = () => api.get("/news/fetch");
export const summarize = (data) => api.post("/ai/summarize", data);
export const chatWithAI = (data) => api.post("/ai/chat", data);

// Auth
export const signupApi = (data) => api.post("/auth/signup", data);
export const loginApi = (data) => api.post("/auth/login", data);
export const getMeApi = () => api.get("/auth/me");

// Bookmarks & History
export const toggleBookmarkApi = (articleId) =>
  api.patch("/users/bookmark", { articleId });
export const getBookmarksApi = () => api.get("/users/bookmarks");
export const addToHistoryApi = (articleId) =>
  api.post("/users/history", { articleId });

export default api;
