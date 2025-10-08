import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import type { Role } from "@/types/models.ts";

interface AuthCheckOptions {
    redirectTo?: string;       // Куда редиректить если не авторизован
    allowedRoles?: Role[];     // Какие роли разрешены
}

export const useAuth = ({ redirectTo = "/admin/login", allowedRoles }: AuthCheckOptions = {}) => {
    const authStore = useAuthStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const user = authStore.user;

        if (!user) {
            setAuthorized(false);
            if (redirectTo) navigate(redirectTo);
        } else if (allowedRoles && !allowedRoles.includes(user.role)) {
            setAuthorized(false);
            if (redirectTo) navigate(redirectTo);
        } else {
            setAuthorized(true);
        }

        setLoading(false);
    }, [authStore.user, allowedRoles, navigate, redirectTo]);

    return { user: authStore.user, authorized, loading };
};
