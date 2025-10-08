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
    const store = localStorage.getItem("auth-storage")
    const token = JSON.parse(store || "")
    if (token.state.token) {
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

