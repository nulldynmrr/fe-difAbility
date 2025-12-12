import axios from "axios";

const request = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 60000,
  withCredentials: true,
});

export default {
  get: (url, params = null, headers = {}) =>
    request({ method: "get", url, params, headers }),

  post: (url, data, headers = {}) =>
    request({
      method: "post",
      url,
      data,
      headers,
    }),

  put: (url, data, headers = {}) =>
    request({ method: "put", url, data, headers }),

  patch: (url, data, headers = {}) =>
    request({ method: "patch", url, data, headers }),

  delete: (url, data) => request({ method: "delete", url, data }),
};
