import {useVotersStore} from "@/store/votersStore.ts";
import {useEffect} from "react";
import {useAuthStore} from "@/store/authStore.ts";
import {Loader2} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";


export default function VoterComponent() {
    const {fetchVotersByCoordinatorId,loading,voters,deleteVoter} = useVotersStore();
    const {user} = useAuthStore()
    console.log(user?.id)
    useEffect(() => {
        fetchVotersByCoordinatorId(user?.id)
    }, []);

    if(loading) return <div className="flex justify-center items-center  mt-6">
        <Loader2 className="animate-spin w-8 h-8" />
    </div>

    return (
        <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Список избирателей</h2>
            <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                <tr>
                    <th className="p-2 border">Имя</th>
                    <th className="p-2 border">Телефон</th>
                    <th className="p-2 border">УИК</th>
                    <th className="p-2 border">ПИН</th>
                    <th className="p-2 border">Дата добавления</th>
                    <th className="p-2 border">Агитатор</th>
                    <th>Действие</th>
                </tr>
                </thead>
                <tbody>
                {voters.map((v) => (
                    <tr key={v.id}>
                        <td className="p-2 border">
                            {v.firstName} {v.lastName}
                        </td>
                        <td className="p-2 border">{v.phone || "—"}</td>
                        <td className="p-2 border">{v.uikCode}</td>
                        <td className="p-2 border">{v.pin}</td>
                        <td className="p-2 border">
                            {new Date(v.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-2 border">
                            {v.addedBy?.firstName} {v.addedBy?.lastName}
                        </td>
                        <td className="p-2 border">
                            <Button
                                variant="destructive"
                                onClick={() => deleteVoter(v.id)}
                            >
                                Удалить
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}