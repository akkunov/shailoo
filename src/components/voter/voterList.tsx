import { useEffect, useState } from "react";
import { voterApi } from "@/api/voters";
import { useUserStore } from "@/store/userStore";
import type { Voter } from "@/types/models";

export default function VoterList() {
    const [voters, setVoters] = useState<Voter[]>([]);
    const user = useUserStore((s) => s.user);

    useEffect(() => {
        voterApi.getAll().then(setVoters).catch(console.error);
    }, []);

    if (!user) return <div>Авторизуйтесь, чтобы увидеть данные</div>;

    const visibleVoters =
        user.role === "ADMIN" || user.role === "COORDINATOR"
            ? voters
            : voters.filter((v) => v.addedById === user.id);

    return (
        <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Список избирателей</h2>
            <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                <tr>
                    <th className="p-2 border">Имя</th>
                    <th className="p-2 border">Телефон</th>
                    <th className="p-2 border">УИК</th>
                    <th className="p-2 border">Дата добавления</th>
                </tr>
                </thead>
                <tbody>
                {visibleVoters.map((v) => (
                    <tr key={v.id}>
                        <td className="p-2 border">
                            {v.firstName} {v.lastName}
                        </td>
                        <td className="p-2 border">{v.phone || "—"}</td>
                        <td className="p-2 border">{v.uikCode}</td>
                        <td className="p-2 border">
                            {new Date(v.createdAt).toLocaleDateString()}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
