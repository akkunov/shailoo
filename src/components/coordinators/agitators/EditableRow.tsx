import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {MultiSelect} from "@/components/ui/multi-select.tsx";
import toast from "react-hot-toast";
import type {UIK, User} from "@/types/models.ts";

interface Props {
    user: User & { isEditing?: boolean };
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

export default function EditableRow({
                                        user,
                                        setEditableUsers,
                                        uiks,
                                        deleteAgitator,
                                        fetchAgitators,
                                        updateAgitator
                                    }: Props) {
    const handleSave = async () => {
        try {
            const payload = {
                firstName: user.firstName,
                lastName: user.lastName,
                middleName: user.middleName,
                phone: user.phone,
                pin: user.pin,
                uiks: user.uiks?.map(u => u.uikCode) || []
            };

            await updateAgitator(user.id, payload);
            toast.success("Изменения сохранены");

            setEditableUsers(prev =>
                prev.map(u => u.id === user.id ? {...u, isEditing: false} : u)
            );
        } catch (err: unknown) {
            if (err instanceof Error) toast.error(err.message);
            else toast.error("Ошибка при сохранении");
        }
    };

    // --- Для десктопа таблица ---
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
        return (
            <tr className="border-b">
                {user.isEditing ? (
                    <>
                        <td className="p-2"><Input value={user.lastName}
                                                   onChange={e => setEditableUsers(prev => prev.map(u => u.id === user.id ? {
                                                       ...u,
                                                       lastName: e.target.value
                                                   } : u))}/></td>
                        <td className="p-2"><Input value={user.firstName}
                                                   onChange={e => setEditableUsers(prev => prev.map(u => u.id === user.id ? {
                                                       ...u,
                                                       firstName: e.target.value
                                                   } : u))}/></td>
                        <td className="p-2"><Input value={user.middleName || ""}
                                                   onChange={e => setEditableUsers(prev => prev.map(u => u.id === user.id ? {
                                                       ...u,
                                                       middleName: e.target.value
                                                   } : u))}/></td>
                        <td className="p-2"><Input value={user.phone}
                                                   onChange={e => setEditableUsers(prev => prev.map(u => u.id === user.id ? {
                                                       ...u,
                                                       phone: e.target.value
                                                   } : u))}/></td>
                        <td className="p-2"><Input value={user.pin}
                                                   onChange={e => setEditableUsers(prev => prev.map(u => u.id === user.id ? {
                                                       ...u,
                                                       pin: e.target.value
                                                   } : u))}/></td>
                        <td className="p-2">{user.role}</td>
                        <td className="p-2">
                            <MultiSelect
                                options={uiks.map(uik => ({
                                    label: `${uik.code} — ${uik.name}`,
                                    value: String(uik.code)
                                }))}
                                selected={user.uiks?.map(i => String(i.uikCode)) || []}
                                onChange={selectedValues => setEditableUsers(prev =>
                                    prev.map(u => u.id === user.id ? {
                                        ...u, uiks: selectedValues.map((v, i) =>
                                            ({
                                                id: u.uiks?.[i]?.id || i,
                                                userId: u.id,
                                                uikCode: Number(v),
                                                uik: u.uiks?.[i]?.uik || null
                                            }))
                                    } : u)
                                )}
                            />
                        </td>
                        <td className="p-2 flex gap-2">
                            <Button onClick={handleSave}>Сохранить</Button>
                            <Button variant="destructive"
                                    onClick={() => setEditableUsers(prev => prev.map(u => u.id === user.id ? {
                                        ...u,
                                        isEditing: false
                                    } : u))}>Отмена</Button>
                        </td>
                    </>
                ) : (
                    <>
                        <td className="p-2">{user.lastName}</td>
                        <td className="p-2">{user.firstName}</td>
                        <td className="p-2">{user.middleName}</td>
                        <td className="p-2">{user.phone}</td>
                        <td className="p-2">{user.pin}</td>
                        <td className="p-2">{user.role}</td>
                        <td className="p-2">{user.uiks?.map(u => u.uikCode).join(", ")}</td>
                        <td className="p-2 flex gap-2">
                            <Button onClick={() => setEditableUsers(prev => prev.map(u => u.id === user.id ? {
                                ...u,
                                isEditing: true
                            } : u))}>Редактировать</Button>
                            <Button variant="destructive" onClick={() => {
                                if (confirm("Удалить этого агитатора?")) deleteAgitator(user.id).then(() => fetchAgitators('agitators'));
                            }}>Удалить</Button>
                        </td>
                    </>
                )}
            </tr>
        );
    }

    // --- Мобильные карточки ---
    return (
        <div className="border rounded-lg p-3 mb-3 flex flex-col gap-2 md:hidden">
            {user.isEditing ? (
                <>
                    <Input value={user.lastName}
                           onChange={e => setEditableUsers(prev => prev.map(u => u.id === user.id ? {
                               ...u,
                               lastName: e.target.value
                           } : u))} placeholder="Фамилия"/>
                    <Input value={user.firstName}
                           onChange={e => setEditableUsers(prev => prev.map(u => u.id === user.id ? {
                               ...u,
                               firstName: e.target.value
                           } : u))} placeholder="Имя"/>
                    <Input value={user.middleName || ""}
                           onChange={e => setEditableUsers(prev => prev.map(u => u.id === user.id ? {
                               ...u,
                               middleName: e.target.value
                           } : u))} placeholder="Отчество"/>
                    <Input value={user.phone} onChange={e => setEditableUsers(prev => prev.map(u => u.id === user.id ? {
                        ...u,
                        phone: e.target.value
                    } : u))} placeholder="Телефон"/>
                    <Input value={user.pin} onChange={e => setEditableUsers(prev => prev.map(u => u.id === user.id ? {
                        ...u,
                        pin: e.target.value
                    } : u))} placeholder="PIN"/>
                    <MultiSelect
                        options={uiks.map(uik => ({label: `${uik.code} — ${uik.name}`, value: String(uik.code)}))}
                        selected={user.uiks?.map(i => String(i.uikCode)) || []}
                        onChange={selectedValues => setEditableUsers(prev =>
                            prev.map(u => u.id === user.id ? {
                                ...u, uiks: selectedValues.map((v, i) =>
                                    ({
                                        id: u.uiks?.[i]?.id || i,
                                        userId: u.id,
                                        uikCode: Number(v),
                                        uik: u.uiks?.[i]?.uik || null
                                    }))
                            } : u)
                        )}
                        placeholder="Выберите УИКи"
                    />
                    <div className="flex gap-2">
                        <Button onClick={handleSave}>Сохранить</Button>
                        <Button variant="destructive"
                                onClick={() => setEditableUsers(prev => prev.map(u => u.id === user.id ? {
                                    ...u,
                                    isEditing: false
                                } : u))}>Отмена</Button>
                    </div>
                </>
            ) : (
                <>
                    <span>Фамилия: {user.lastName}</span>
                    <span>Имя: {user.firstName}</span>
                    <span>Отчество: {user.middleName}</span>
                    <span>Телефон: {user.phone}</span>
                    <span>PIN: {user.pin}</span>
                    <span>Роль: {user.role}</span>
                    <span>УИК: {user.uiks?.map(u => u.uikCode).join(", ")}</span>
                    <div className="flex gap-2">
                        <Button onClick={() => setEditableUsers(prev => prev.map(u => u.id === user.id ? {
                            ...u,
                            isEditing: true
                        } : u))}>Редактировать</Button>
                        <Button variant="destructive" onClick={() => {
                            if (confirm("Удалить этого агитатора?")) deleteAgitator(user.id).then(() => fetchAgitators('agitators'));
                        }}>Удалить</Button>
                    </div>
                </>
            )}
        </div>
    );
}
