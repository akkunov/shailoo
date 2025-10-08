import { lazy, Suspense} from "react";
import type {JSX} from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";
import type { Role } from "@/types/models";

const AdminDashboard = lazy(() => import("../admin/Dashboard.tsx"));
const CoordinatorDashboard = lazy(() => import("../coordinator/Dashboard.tsx"));
const AgitatorDashboard = lazy(() => import("../agitator/Dashboard.tsx"));

const roleToComponent: Record<Role, React.LazyExoticComponent<() => JSX.Element>> = {
    ADMIN: AdminDashboard,
    COORDINATOR: CoordinatorDashboard,
    AGITATOR: AgitatorDashboard,
};

export default function DashboardRouter() {
    const { user } = useAuthStore();

    if (!user) {
        return <div className="text-center mt-20 text-gray-500">Загрузка пользователя...</div>;
    }

    const Component = roleToComponent[user.role];

    if (!Component) {
        return <div className="text-center mt-20 text-red-500">Нет доступа для роли {user.role}</div>;
    }

    return (
        <>
            <Suspense
                fallback={
                    <div className="flex justify-center items-center h-screen">
                        <Loader2 className="animate-spin w-8 h-8" />
                    </div>
                }
            >
                <Component />
            </Suspense>
        </>

    );
}
