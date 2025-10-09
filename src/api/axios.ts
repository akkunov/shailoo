import axios from "axios";

export const api = axios.create({
    baseURL: "https://shailo-server.vercel.app/api",
    withCredentials: true, // чтобы куки передавались
});

api.interceptors.request.use((res) => {
    const store = localStorage.getItem('auth-storage')
    const token = store && JSON.parse(store);
    console.log(token)

    res.headers.Authorization = `Bearer ${token?.state.token}`
    return res
})
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
            // localStorage.removeItem("token")
            // localStorage.removeItem("user")
            // window.location.href = "/admin/login"
        }
        return Promise.reject(error)
    }
)

