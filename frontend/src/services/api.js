import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

//Interceptor: before any request, do something

//add token to any request
//ret for return
api.interceptors.request.use((retApi) => {
  const token = localStorage.getItem("token");
  if (token) {
    retApi.headers.Authorization = "Bearer {token}";
  }
  return retApi;
});

//handle expired token
api.interceptors.response.use(
  //if token is not expired
  (response) => response,
  //if token is expired
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
