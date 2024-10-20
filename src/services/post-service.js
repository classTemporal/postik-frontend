import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://192.168.100.229:8080/api/post/all";

export const getAllPostsInHome = () => {
    return axios.get(API_URL);
};

export const getAllPostsByUsername = (username) => {
    if (username != null) {
      return axios.get(`${API_URL}/${username}`, { headers: authHeader() });
    } else {
      return Promise.reject(new Error("Username no encontrado"));
    }
  };

export default getAllPostsInHome;