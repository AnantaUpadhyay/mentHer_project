import axios from "axios";
const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  withCredentials: true,
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config?.url?.startsWith("/auth/")
    ) {
      window.dispatchEvent(new Event("menther:session-expired"));
    }
    return Promise.reject(error);
  },
);
export default api;
