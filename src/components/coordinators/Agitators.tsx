import {useEffect, useState} from "react";
import {useAgitatorsStore} from "@/store/agitatorsStore";
import {useAuthStore} from "@/store/authStore";
import {api} from "@/api/axios.ts";
import {Loader2} from "lucide-react";
import toast, {Toaster} from "react-hot-toast";

import type {UIK, User} from "@/types/models";
import AgitatorForm from "@/components/coordinators/agitators/AgitatorForm.tsx";
import AgitatorsTable from "@/components/coordinators/agitators/AgitatorsTable.tsx";


type EditableUser = User & { isEditing?: boolean };

export default function AgitatorsComponent() {
    const {user} = useAuthStore();
    const {fetchAgitators, createAgitator, deleteAgitator,updateAgitator, agitators, loading, error} = useAgitatorsStore();
    const [editableUsers, setEditableUsers] = useState<EditableUser[]>([]);
    const [uiks, setUiks] = useState<UIK[]>([]);

    useEffect(() => {
        fetchAgitators("agitators").catch(() => toast.error("Ошибка загрузки агитаторов"));
        api.get("/uiks").then(res => setUiks(res.data)).catch(() => toast.error("Ошибка загрузки УИКов"));
    }, []);

    useEffect(() => {
        setEditableUsers(agitators);
    }, [agitators]);

    if (loading) return <div className="w-full h-full flex items-center justify-center"><Loader2
        className="animate-spin w-8 h-8"/></div>;
    if (error) return <div className="w-full h-full flex items-center justify-center text-red-500">{error}</div>;

    return (
        <div className="p-4">
            <Toaster/>
            <AgitatorForm
                user={user}
                uiks={uiks}
                createAgitator={createAgitator}
                fetchAgitators={fetchAgitators}/>
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
