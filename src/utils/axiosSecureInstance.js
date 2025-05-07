// utils/axiosSecureInstance.js
import axios from "axios";
import { API_BASE_URL } from "../Helper/apicall.js";

// Base axios for token fetch (no interceptors here)
const plainAxios = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true, 
});

const axiosSecure = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let csrfToken = null;

async function fetchCsrfToken() {
  try {
    const response = await plainAxios.get("/csrf-token");
    csrfToken = response.data.csrfToken;
    return csrfToken;
  } catch (err) {
    console.error("Error fetching CSRF token", err);
    return null;
  }
}

axiosSecure.interceptors.request.use(
  async (config) => {
    if (!csrfToken) {
      await fetchCsrfToken();
    }
    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { axiosSecure, fetchCsrfToken };

// import axios from "axios";
// import { API_BASE_URL } from "../Helper/apicall.js";

// const plainAxios = axios.create({
//   baseURL: `${API_BASE_URL}/api`,
//   withCredentials: true, 
// });
// const axiosSecure = axios.create({
//   baseURL: `${API_BASE_URL}/api`,
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });
// let csrfToken = null;
// async function fetchCsrfToken() {
//   try {
//     const response = await plainAxios.get("/csrf-token");
//     csrfToken = response.data.csrfToken;
//     return csrfToken;
//   } catch (err) {
//     console.error("Error fetching CSRF token", err);
//     return null;
//   }
// }
// const setupInterceptors = (fetchUser ) => {
//   axiosSecure.interceptors.request.use(
//     async (config) => {
//       if (!csrfToken) {
//         await fetchCsrfToken();
//       }
//       if (csrfToken) {
//         config.headers["X-CSRF-Token"] = csrfToken;
//       }
//       await fetchUser (); // Call fetchUser  before every request
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );
// };
// export { axiosSecure, fetchCsrfToken, setupInterceptors };
