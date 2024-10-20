import axios from "axios";

const API_URL = "http://192.168.100.229:8080/api/auth/";

const register = (username, password) => {
  return axios.post(API_URL + "register", {
    username,
    password,
  });
};

const login = async (username, password) => {
  const response = await axios
    .post(API_URL + "login", {
      username,
      password,
    });
  if (response.data.accessToken) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem("user");
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  register,
  login,
  logout,
};