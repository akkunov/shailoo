import { useEffect } from "react";
import { useVotersStore } from "@/store/votersStore.ts";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import SearchComponent from "@/components/search/Search.tsx";
import {Toaster} from "react-hot-toast";

export default function VoterList() {
    const { fetchVotersByAgitator, loading, voters, deleteVoter } = useVotersStore();

    useEffect(() => {
        fetchVotersByAgitator();
    }, []);

    if (loading)
        return (
            <div className="flex justify-center items-center mt-6">
                <Loader2 className="animate-spin w-8 h-8 text-primary" />
            </div>
        );

    return (
        <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Список избирателей</h2>
            <SearchComponent type={'voter'}/>
            <Toaster />
            {/* Десктопная таблица */}
            <div className="hidden md:block overflow-x-auto rounded-lg border shadow-sm">
                <table className="w-full border-collapse text-sm">
                    <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="p-3 border">Имя</th>
                        <th className="p-3 border">Телефон</th>
                        <th className="p-3 border">УИК</th>
                        <th className="p-3 border">ПИН</th>
                        <th className="p-3 border">Дата</th>
                        <th className="p-3 border">Агитатор</th>
                        <th className="p-3 border">Действие</th>
                    </tr>
                    </thead>
                    <tbody>
                    {voters.map((v) => (
                        <tr key={v.id} className="hover:bg-gray-50 transition">
                            <td className="p-3 border">
                                {v.firstName} {v.lastName}
                            </td>
                            <td className="p-3 border">{v.phone || "—"}</td>
                            <td className="p-3 border text-center">{v.uikCode}</td>
                            <td className="p-3 border text-center">{v.pin}</td>
                            <td className="p-3 border text-center">
                                {new Date(v.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-3 border">
                                {v.addedBy?.firstName} {v.addedBy?.lastName}
                            </td>
                            <td className="p-3 border text-center">
                                <Button
                                    variant="destructive"
                                    size="sm"
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

            {/* Мобильная версия — карточки */}
            <div className="md:hidden space-y-3">
                {voters.map((v) => (
                    <div
                        key={v.id}
                        className="border rounded-lg shadow-sm p-4 bg-white space-y-2"
                    >
                        <div className="flex justify-between">
                            <h3 className="font-semibold text-gray-900">
                                {v.firstName} {v.lastName}
                            </h3>
                            <span className="text-xs text-gray-500">
                {new Date(v.createdAt).toLocaleDateString()}
              </span>
                        </div>
                        <div className="text-sm text-gray-700 space-y-1">
                            <p>
                                <span className="font-medium">Телефон:</span> {v.phone || "—"}
                            </p>
                            <p>
                                <span className="font-medium">УИК:</span> {v.uikCode}
                            </p>
                            <p>
                                <span className="font-medium">ПИН:</span> {v.pin}
                            </p>
                            <p>
                                <span className="font-medium">Агитатор:</span>{" "}
                                {v.addedBy?.firstName} {v.addedBy?.lastName}
                            </p>
                        </div>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="w-full mt-2"
                            onClick={() => deleteVoter(v.id)}
                        >
                            Удалить
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
