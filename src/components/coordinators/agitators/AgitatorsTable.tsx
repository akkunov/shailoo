import type { UIK, User } from "@/types/models.ts";
import EditableRow from "./EditableRow.tsx";

interface Props {
    editableUsers: (User & { isEditing?: boolean })[];
    setEditableUsers: React.Dispatch<React.SetStateAction<(User & { isEditing?: boolean })[]>>;
    uiks: UIK[];
    deleteAgitator: (id: number) => Promise<void>;
    fetchAgitators: (type: string) => Promise<void>;
    updateAgitator: (id: number, data: {
        firstName?: string;
        lastName?: string;
        middleName?: string;
        phone?: string;
        pin?: string;
        uiks?: number[];
    }) => Promise<void>;
}

export default function AgitatorsTable({
                                           editableUsers,
                                           setEditableUsers,
                                           uiks,
                                           deleteAgitator,
                                           fetchAgitators,
                                           updateAgitator
                                       }: Props) {
    return (
        <div className="mt-4">
            {/* --- Для десктопа таблица --- */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 min-w-[600px]">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">Фамилия</th>
                        <th className="border p-2">Имя</th>
                        <th className="border p-2">Отчество</th>
                        <th className="border p-2">Телефон</th>
                        <th className="border p-2">PIN</th>
                        <th className="border p-2">Роль</th>
                        <th className="border p-2">УИК</th>
                        <th className="border p-2">Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {editableUsers.map(user =>
                        <EditableRow
                            key={user.id}
                            user={user}
                            setEditableUsers={setEditableUsers}
                            uiks={uiks}
                            deleteAgitator={deleteAgitator}
                            fetchAgitators={fetchAgitators}
                            updateAgitator={updateAgitator}
                        />
                    )}
                    </tbody>
                </table>
            </div>

            {/* --- Для мобильных карточки --- */}
            <div className="md:hidden flex flex-col gap-3">
                {editableUsers.map(user =>
                    <EditableRow
                        key={user.id}
                        user={user}
                        setEditableUsers={setEditableUsers}
                        uiks={uiks}
                        deleteAgitator={deleteAgitator}
                        fetchAgitators={fetchAgitators}
                        updateAgitator={updateAgitator}
                    />
                )}
            </div>
        </div>
    );
}
