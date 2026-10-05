import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllPosts = () => {
  return api.get("/posts");
};

export const getPostById = (id) => {
  return api.get(`/posts/${id}`);
};

export const createPost = (postData) => {
  return api.post("/posts", postData);
};

export const updatePost = (id, postData) => {
  return api.put(`/posts/${id}`, postData);
};

export const deletePost = (id) => {
  return api.delete(`/posts/${id}`);
};

export const getScheduledPosts = () => {
  return api.get("/posts/scheduled");
};

export const schedulePost = (id, scheduledAt) => {
  return api.post(`/posts/${id}/schedule`, {
    scheduledAt,
  });
};

export default api;