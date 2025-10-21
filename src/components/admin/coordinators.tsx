// src/pages/CorrespondentsPage.tsx
import { useEffect, useState } from "react";
import { useCorrespondentsStore } from "@/store/correspondentsStore.ts";
import type {Role, User} from "@/types/models.ts";
import  {Roles} from "@/types/models.ts";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import toast, { Toaster } from "react-hot-toast";

type EditableUser = User & { isEditing?: boolean };

export default function CoordinatorsComponent() {
    const {
        correspondents,
        fetchCorrespondents,
        createCorrespondent,
        updateCorrespondent,
        deleteCorrespondent,
        loading,
    } = useCorrespondentsStore();

    const [newUser, setNewUser] =
        useState<Omit<User, "id" | "createdAt" | "updatedAt"> | null>(null);
    const [editableUsers, setEditableUsers] = useState<EditableUser[]>([]);

    useEffect(() => {
        fetchCorrespondents();
    }, []);

    useEffect(() => {
        setEditableUsers(correspondents);
    }, [correspondents]);

    const handleChange = (id: number, field: keyof User, value: string) => {
        setEditableUsers((prev) =>
            prev.map((u) => (u.id === id ? { ...u, [field]: value } : u))
        );
    };

    const handleSave = async (user: EditableUser) => {
        try {
            await updateCorrespondent(user.id, {
                firstName: user.firstName,
                lastName: user.lastName,
                middleName: user.middleName,
                phone: user.phone,
                pin: user.pin,
                role: user.role,
            });
            toast.success("Корреспондент обновлен");
            setEditableUsers((prev) =>
                prev.map((u) =>
                    u.id === user.id ? { ...u, isEditing: false } : u
                )
            );
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Ошибка при обновлении");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Вы точно хотите удалить этого корреспондента?")) return;
        try {
            await deleteCorrespondent(id);
            toast.success("Корреспондент удален");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Ошибка при удалении");
        }
    };

    const handleAddNew = async () => {
        if (!newUser) return;
        try {
            await createCorrespondent(newUser);
            toast.success("Добавлен");
            setNewUser(null);
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Ошибка при создании");
        }
    };

    return (
        <div className="p-6">
            <Toaster />
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Список корреспондентов</h1>
                <Button
                    onClick={() =>
                        setNewUser({
                            firstName: "",
                            lastName: "",
                            middleName: "",
                            phone: "",
                            pin: "",
                            role: "COORDINATOR",
                            password:'Pass200042-'
                        })
                    }
                >
                    Добавить нового
                </Button>
            </div>

            {newUser && (
                <div className="flex gap-2 mb-4">
                    <Input
                        placeholder="Фамилия"
                        value={newUser.lastName}
                        onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                    />
                    <Input
                        placeholder="Имя"
                        value={newUser.firstName}
                        onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                    />
                    <Input
                        placeholder="Отчество"
                        value={newUser.middleName || ""}
                        onChange={(e) =>
                            setNewUser({ ...newUser, middleName: e.target.value })
                        }
                    />
                    <Input
                        placeholder="Телефон"
                        value={newUser.phone}
                        onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    />
                    <Input
                        placeholder="PIN"
                        value={newUser.pin}
                        onChange={(e) => setNewUser({ ...newUser, pin: e.target.value })}
                    />
                    <select
                        className="border rounded p-2"
                        value={newUser.role}
                        onChange={(e) =>
                            setNewUser({ ...newUser, role: e.target.value as Role })
                        }
                    >
                        {Object.values(Roles).map((r) => (
                            <option key={r} value={r}>
                                {r}
                            </option>
                        ))}
                    </select>
                    <Button onClick={handleAddNew}>Сохранить</Button>
                    <Button
                        variant="destructive"
                        onClick={() => setNewUser(null)}
                    >
                        Отмена
                    </Button>
                </div>
            )}

            <table className="w-full border-collapse border border-gray-300">
                <thead>
                <tr className="bg-gray-100">
                    <th className="border p-2">Фамилия</th>
                    <th className="border p-2">Имя</th>
                    <th className="border p-2">Отчество</th>
                    <th className="border p-2">Телефон</th>
                    <th className="border p-2">PIN</th>
                    <th className="border p-2">Роль</th>
                    <th className="border p-2">Действия</th>
                </tr>
                </thead>
                <tbody>
                {editableUsers.map((user) => (
                    <tr key={user.id} className="border-b">
                        {user.isEditing ? (
                            <>
                                <td className="p-2">
                                    <Input
                                        value={user.lastName}
                                        onChange={(e) =>
                                            handleChange(user.id, "lastName", e.target.value)
                                        }
                                    />
                                </td>
                                <td className="p-2">
                                    <Input
                                        value={user.firstName}
                                        onChange={(e) =>
                                            handleChange(user.id, "firstName", e.target.value)
                                        }
                                    />
                                </td>
                                <td className="p-2">
                                    <Input
                                        value={user.middleName || ""}
                                        onChange={(e) =>
                                            handleChange(user.id, "middleName", e.target.value)
                                        }
                                    />
                                </td>
                                <td className="p-2">
                                    <Input
                                        value={user.phone}
                                        onChange={(e) =>
                                            handleChange(user.id, "phone", e.target.value)
                                        }
                                    />
                                </td>
                                <td className="p-2">
                                    <Input
                                        value={user.pin}
                                        onChange={(e) =>
                                            handleChange(user.id, "pin", e.target.value)
                                        }
                                    />
                                </td>
                                <td className="p-2">
                                    <select
                                        className="border rounded p-2 w-full"
                                        value={user.role}
                                        onChange={(e) =>
                                            handleChange(user.id, "role", e.target.value as Role)
                                        }
                                    >
                                        {Object.values(Roles).map((r) => (
                                            <option key={r} value={r}>
                                                {r}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="p-2 flex gap-2">
                                    <Button
                                        className="text-black"
                                        onClick={() => handleSave(user)}
                                    >
                                        Сохранить
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="text-black"
                                        onClick={() =>
                                            setEditableUsers((prev) =>
                                                prev.map((u) =>
                                                    u.id === user.id
                                                        ? { ...u, isEditing: false }
                                                        : u
                                                )
                                            )
                                        }
                                    >
                                        Отмена
                                    </Button>
                                </td>
                            </>
                        ) : (
                            <>
                                <td className="p-2">{user.lastName}</td>
                                <td className="p-2">{user.firstName}</td>
                                <td className="p-2">{user.middleName}</td>
                                <td className="p-2">{user.phone}</td>
                                <td className="p-2">{user.pin}</td>
                                <td className="p-2 font-medium">{user.role}</td>
                                <td className="p-2 flex gap-2">
                                    <Button
                                        onClick={() =>
                                            setEditableUsers((prev) =>
                                                prev.map((u) =>
                                                    u.id === user.id
                                                        ? { ...u, isEditing: true }
                                                        : u
                                                )
                                            )
                                        }
                                    >
                                        Редактировать
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        Удалить
                                    </Button>
                                </td>
                            </>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>

            {loading && <p>Загрузка...</p>}
        </div>
    );
}
