// // import api from "./api";

// import api from "./api";

// let isRefreshing = false;
// let failedQueue: any[] = [];

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach(({ resolve, reject }) => {
//     if (error) reject(error);
//     else resolve(token);
//   });
//   failedQueue = [];
// };

// api.interceptors.response.use(
//   (res) => res,
//   async (err) => {
//     const originalReq = err.config;
//     if (err.response?.status === 401 && !originalReq._retry) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             originalReq.headers.Authorization = `Bearer ${token}`;
//             return api(originalReq);
//           })
//           .catch((e) => Promise.reject(e));
//       }

//       originalReq._retry = true;
//       isRefreshing = true;

//       const refreshToken = localStorage.getItem("refresh_token");
//       try {
//         const resp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/refresh/`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ refresh: refreshToken }),
//         });
//         if (!resp.ok) throw new Error("Could not refresh");
//         const data = await resp.json();
//         const newAccess = data.access;
//         localStorage.setItem("access_token", newAccess);
//         api.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;
//         processQueue(null, newAccess);
//         isRefreshing = false;
//         originalReq.headers.Authorization = `Bearer ${newAccess}`;
//         return api(originalReq);
//       } catch (refreshError) {
//         processQueue(refreshError, null);
//         isRefreshing = false;
//         clearTokens();
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(err);
//   }
// );
