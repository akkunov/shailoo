import { useEffect, useState } from "react";
import { useAgitatorsStore } from "@/store/agitatorsStore";
import { Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import type {UIK, User} from "@/types/models";
import AgitatorsTable from "@/components/coordinators/agitators/AgitatorsTable.tsx";
import {api} from "@/api/axios.ts";
import AdminSearchPage from "@/components/admin/AdminSearchPage.tsx";

export default function AgitatorsComponent() {
    const {
        agitators,
        loading,
        error,
        fetchAgitators,
        deleteAgitator,
        updateAgitator,
    } = useAgitatorsStore();

    const [editableUsers, setEditableUsers] = useState<(User & { isEditing?: boolean })[]>([]);
    const [uiks, setUiks] = useState<UIK[]>([])



    useEffect(() => {
        fetchAgitators("agitators").catch(() => toast.error("Ошибка загрузки агитаторов"));
        api.get("/uiks").then(res => setUiks(res.data)).catch(() => toast.error("Ошибка загрузки УИКов"));
    }, []);

    // --- Fetch agitators ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchAgitators( "all-agitators");
                toast.success("Данные обновлены");
            } catch (err: unknown) {
                toast.error(err instanceof Error ? err.message : "Ошибка загрузки данных");
            }
        };
        fetchData();
    }, []);

    // --- Синхронизация состояния редактирования ---
    useEffect(() => {
        setEditableUsers(agitators.map((u) => ({ ...u, isEditing: false })));
    }, [agitators]);

    if (loading)
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <Loader2 className="animate-spin w-8 h-8" />
            </div>
        );

    if (error) return <div>Ошибка загрузки данных</div>;

    return (
        <div className="p-4">
            <Toaster />
            <AdminSearchPage />
            <AgitatorsTable
                editableUsers={editableUsers}
                setEditableUsers={setEditableUsers}
                uiks={uiks}
                deleteAgitator={deleteAgitator}
                fetchAgitators={fetchAgitators}
                updateAgitator={updateAgitator}
            />
        </div>
    );
}
