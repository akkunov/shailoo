import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import type { Role } from "@/types/models";

interface ProtectedRouteProps {
    allowedRoles?: Role[];
    children: React.ReactNode;
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
    const { user } = useAuthStore();

    if (!user) return <Navigate to="/admin/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
}
