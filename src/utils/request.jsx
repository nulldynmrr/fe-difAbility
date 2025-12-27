import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

function getCookie(name) {
  if (typeof window === "undefined") return null;

  try {
    const fromStorage = localStorage.getItem(name);
    if (fromStorage) return fromStorage;
  } catch (e) {}

  const fromJsCookie = Cookies.get(name);
  if (fromJsCookie) return fromJsCookie;

  if (typeof document !== "undefined" && document.cookie) {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split("=");
      if (cookieName === name) return decodeURIComponent(cookieValue);
    }
  }

  return null;
}

export function getCurrentUser() {
  try {
    const token = getCookie("token");
    if (!token) return null;

    const decoded = jwtDecode(token);
    return {
      id: decoded.id,
      email: decoded.sub,
      username: decoded.sub,
      name: decoded.sub?.split("@")[0] || "User",
      role: decoded.role,
      companyId: decoded.companyId || null,
    };
  } catch {
    return null;
  }
}

export function clearAuth() {
  try {
    Cookies.remove("token");
    Cookies.remove("token", { path: "/" });

    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }

    delete request.defaults.headers.common.Authorization;
  } catch (e) {}
}

const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HOST + "/api",
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

request.interceptors.request.use(
  (config) => {
    const token = getCookie("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

//401
request.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      Cookies.remove("token");
      Cookies.remove("token", { path: "/" });
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const api = {
  get: (url, params = null, config = {}) =>
    request({ method: "get", url, params, ...config }),

  post: (url, data, config = {}) =>
    request({ method: "post", url, data, ...config }),

  put: (url, data, config = {}) =>
    request({ method: "put", url, data, ...config }),

  patch: (url, data, config = {}) =>
    request({ method: "patch", url, data, ...config }),

  delete: (url, data, config = {}) =>
    request({ method: "delete", url, data, ...config }),

  uploadFile: (endpoint, file, onUploadProgress) => {
    const fd = new FormData();
    fd.append("file", file);

    return request.post(endpoint, fd, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    });
  },
};

export default api;
