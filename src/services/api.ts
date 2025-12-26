import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// 请求拦截（token、log 等）
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = token || "";
  return config;
});

// 响应拦截
client.interceptors.response.use(
  (res) => {
    console.log(res);

    if (res.data.code === 0) {
      return res.data.data;
    }

    if (res.data.code === 403) {
      window.location.href = "/";
    }
    throw new Error(res.data.msg);
  },
  (err) => Promise.reject(err)
);

export default client;
