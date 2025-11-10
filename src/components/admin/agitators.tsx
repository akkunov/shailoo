import { useEffect, useState } from "react";
import { useAgitatorsStore } from "@/store/agitatorsStore";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import type {UIK, User} from "@/types/models";
import AgitatorsTable from "@/components/coordinators/agitators/AgitatorsTable.tsx";
import {api} from "@/api/axios.ts";

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
    const [search, setSearch] = useState("");
    const [debouncedValue, setDebouncedValue] = useState(search);
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [uiks, setUiks] = useState<UIK[]>([])

    // --- Debounce search ---
    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            return;
        }
        const timeout = setTimeout(() => {
            setDebouncedValue(search.trim());
        }, 500);
        return () => clearTimeout(timeout);
    }, [search]);


    useEffect(() => {
        fetchAgitators("agitators").catch(() => toast.error("Ошибка загрузки агитаторов"));
        api.get("/uiks").then(res => setUiks(res.data)).catch(() => toast.error("Ошибка загрузки УИКов"));
    }, []);

    // --- Fetch agitators ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchAgitators(debouncedValue ? `search?query=${debouncedValue}` : "all-agitators");
                toast.success("Данные обновлены");
            } catch (err: unknown) {
                toast.error(err instanceof Error ? err.message : "Ошибка загрузки данных");
            }
        };
        if (!isFirstRender) fetchData();
        else {
            fetchAgitators("all-agitators").catch(console.error);
        }
    }, [debouncedValue]);

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
            <div className="mb-4 flex justify-between items-center">
                <Input
                    placeholder="Поиск агитатора..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-1/2"
                />
            </div>

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
