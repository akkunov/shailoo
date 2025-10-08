import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3001/api",
    withCredentials: true, // чтобы куки передавались
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        console.error("API error:", err.response?.data || err.message);
        throw err;
    }
);

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// ✅ Обрабатываем 401 (не авторизован)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            window.location.href = "/admin/login"
        }
        return Promise.reject(error)
    }
)

