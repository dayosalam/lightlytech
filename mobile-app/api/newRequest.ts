import axios from "axios";
import { Storage } from "@/utils/storage";

const newRequest = axios.create({
  baseURL: "http://localhost:3003/api",
  headers: {
    "Content-Type": "application/json",
  },
});

newRequest.interceptors.request.use(
  async (config) => {
    try {
      const token = await Storage.getItem("userToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error("Error in axios interceptor:", error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default newRequest;
