import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://192.168.100.229:8080/api/user";

export const getAllUsers = () => {
  return axios.get(`${API_URL}/all`, { headers: authHeader() });
}

export const getPostsById = (userId) => {
  const parsedUserId = parseInt(userId, 10);

  if (parsedUserId) {
    return axios.get(`${API_URL}/${parsedUserId}`, { headers: authHeader() });
  } else {
    return Promise.reject(new Error("ID de usuario no encontrado en el localStorage"));
  }
};

export const createPost = (userId, postData) => {
  const parsedUserId = parseInt(userId, 10);

  if (parsedUserId) {
    return axios.post(`${API_URL}/${parsedUserId}/create`, postData, { headers: authHeader() });
  } else {
    return Promise.reject(new Error("ID de usuario no encontrado en el localStorage"));
  }
};

export const editPostById = (userId, postId, postData) => {
  const parsedUserId = parseInt(userId, 10);

  if (parsedUserId) {
    return axios.put(`${API_URL}/${parsedUserId}/edit/${postId}`, postData, { headers: authHeader() });
  } else {
    return Promise.reject(new Error("ID de usuario no encontrado en el localStorage"));
  }
};

export const deletePostById = (userId, postId) => {
  const parsedUserId = parseInt(userId, 10);

  if (parsedUserId) {
    return axios.delete(`${API_URL}/${parsedUserId}/delete/${postId}`, { headers: authHeader() });
  } else {
    return Promise.reject(new Error("ID de usuario no encontrado en el localStorage"));
  }
};
