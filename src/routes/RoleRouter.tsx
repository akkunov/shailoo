import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export function RoleRouter() {
    const { user } = useAuthStore();

    if (!user) return <Navigate to="/login" replace />;

    switch (user.role) {
        case "ADMIN":
            return <Navigate to="/admin" replace />;
        case "COORDINATOR":
            return <Navigate to="/coordinator" replace />;
        case "AGITATOR":
            return <Navigate to="/agitator" replace />;
        default:
            return <Navigate to="/login" replace />;
    }
}
