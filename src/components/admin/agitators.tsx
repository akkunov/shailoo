import {useAgitatorsStore} from "@/store/agitatorsStore.tsx";
import {useEffect} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Loader2} from "lucide-react";
import toast, {Toaster} from "react-hot-toast";

export default function AgitatorsComponent() {
    const {agitators, loading, error, fetchAgitators} = useAgitatorsStore();
    useEffect(() => {
        fetchAgitators('all-agitators')
            .then(() => toast.success("Данные загружены"))
            .catch((err) => toast.error(err.message));
    }, []);

    if (loading) return <div className={`flex flex-col items-center justify-center h-screen`}>
        <Loader2 className="animate-spin w-8 h-8"/>
    </div>
    if (error) return <div>Ошибка загрузки данных</div>
    return (
        <div>
            <Toaster/>
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
                    {agitators.map((user) => (
                        <tr key={user.id}>
                            <td className="p-2">{user.lastName}</td>
                            <td className="p-2">{user.firstName}</td>
                            <td className="p-2">{user.middleName}</td>
                            <td className="p-2">{user.phone}</td>
                            <td className="p-2">{user.pin}</td>
                            <td className="p-2 font-medium">{user.role}</td>
                            <td className="p-2 flex gap-2">
                                <Button
                                    variant="destructive"
                                >
                                    Удалить
                                </Button>
                            </td>
                        </tr>
                        ) )}
                </tbody>
            </table>

        </div>
);
}