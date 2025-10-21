import "./App.css";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

import AuthForm from "@/pages/auth-form";
import Root from "@/pages/MainRoot";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { RoleRouter } from "@/routes/RoleRouter";

// Admin pages
import AdminDashboard from "@/pages/admin/Dashboard";
import CoordinatorsList from "@/pages/admin/CoordinatorsList.tsx";
import AgitatorList from "@/pages/admin/AgitatorList.tsx";

// Coordinator pages
import CoordinatorDashboard from "@/pages/coordinator/Dashboard";
import AgitatorsPage from "@/pages/coordinator/AgitatorsPage.tsx";
import VotersPage from "@/pages/coordinator/VotersPage";

// Agitator pages
import AgitatorDashboard from "@/pages/agitator/Dashboard";
import AgitatorVotersPage from "@/pages/agitator/VotersPage";
import DashboardRouter from "@/pages/dahsboard";
import VoterList from "@/pages/admin/VoterList.tsx";
import StatsPage from "@/pages/StatsPage.tsx";
import ResetPasswordPage from "@/pages/reset-password.tsx";



export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route path="/admin/login" element={<AuthForm />} />

            <Route path="/" element={<Root />}>

                <Route index element={<RoleRouter />} />
                <Route  path={'reset-password'} element={<ResetPasswordPage />}/>
                <Route
                    path="admin"
                    element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                >
                    <Route path="coordinators" element={<CoordinatorsList />} />
                    <Route path="agitators" element={<AgitatorList />} />
                    <Route path="voters" element={<VoterList />} />
                    <Route path="stats" element={<StatsPage />} />
                </Route>

                {/* --- COORDINATOR --- */}
                <Route
                    path="coordinator"
                    element={
                        <ProtectedRoute allowedRoles={["COORDINATOR"]}>
                            <CoordinatorDashboard />
                        </ProtectedRoute>
                    }
                >
                    <Route path="agitators" element={<AgitatorsPage />} />
                    <Route path="voters" element={<VotersPage />} />
                </Route>

                {/* --- AGITATOR --- */}
                <Route
                    path="agitator"
                    element={
                        <ProtectedRoute allowedRoles={["AGITATOR"]}>
                            <AgitatorDashboard />
                        </ProtectedRoute>
                    }
                >
                    <Route path="voters" element={<AgitatorVotersPage />} />
                </Route>

                {/* --- DASHBOARD --- */}
                <Route path="dashboard" element={<DashboardRouter />} />
            </Route>
        </Route>
    )
);
