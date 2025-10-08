import axios from "axios";

export const api = axios.create({
    baseURL: "https://shailo-server-production.up.railway.app/api",
    withCredentials: true, // чтобы куки передавались
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        console.error("API error:", err.response?.data || err.message);
        throw err;
    }
);

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

