import { useEffect, useState } from "react";
import { api } from "@/api/axios";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { UIK, Voter } from "@/types/models.ts";
import {Loader2} from "lucide-react";

interface User {
    id: number;
    name: string;
    coordinator: string;
    votersCount: number;
    voters: Voter[];
    uiks: UIK[];
}

interface AggregateUser {
    totalAgitators: number;
    totalVoters: number;
    data: User[];
    skip: number;
    take: number;
}

export default function StatsPage() {
    const [userStats, setUserStats] = useState<AggregateUser>();
    const [loading, setLoading] = useState(false);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [coordinatorId, setCoordinatorId] = useState<number | undefined>();
    const [uikFilter, setUikFilter] = useState<number[]>([]);

    const [skip, setSkip] = useState(0);
    const take = 50;

    const loadData = async (newSkip?: number) => {
        setLoading(true);
        if (typeof newSkip === "number") setSkip(newSkip); // если передан новый skip
        try {
            const params: Record<string, string> = {
                skip: String(newSkip ?? skip),
                take: String(take),
            };
            if (startDate) params.dateFrom = startDate;
            if (endDate) params.dateTo = endDate;
            if (coordinatorId) params.coordinatorId = String(coordinatorId);
            if (uikFilter.length) params.uikFilter = uikFilter.join(",");

            const res = await api.get("/stats/getStat", { params });
            setUserStats(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [startDate, endDate, coordinatorId, uikFilter]);

    const totalPages = userStats ? Math.ceil(userStats.totalAgitators / take) : 0;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">📊 Статистика агитаторов</h1>
                <Button onClick={() => loadData(0)} disabled={loading}>
                    {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2 inline" /> : null}
                    {loading ? "Загрузка..." : "Обновить"}
                </Button>
            </div>

            {/* Таблица */}
            <Card>
                <CardHeader>
                    <CardTitle>Подробная таблица</CardTitle>
                    <div className="flex gap-6 text-sm mt-2">
                        <span>Общее количество агитаторов: {userStats?.totalAgitators}</span>
                        <span>Общее количество избирателей: {userStats?.totalVoters}</span>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin w-10 h-10 text-gray-500" />
                        </div>
                    ) : (
                        <table className="min-w-full border-collapse">
                            <thead>
                            <tr className="text-left text-sm border-b">
                                <th className="p-2">№</th>
                                <th className="p-2">Имя</th>
                                <th className="p-2">Координатор</th>
                                <th className="p-2">Количество избирателей</th>
                                <th className="p-2">УИК</th>
                            </tr>
                            </thead>
                            <tbody>
                            {userStats?.data.map((user, idx) => (
                                <tr key={user.id} className="border-b hover:bg-muted/30">
                                    <td className="p-2">{skip + idx + 1}</td>
                                    <td className="p-2">{user.name}</td>
                                    <td className="p-2">{user.coordinator}</td>
                                    <td className="p-2 font-medium">
                                        <Link to="#">{user.votersCount}</Link>
                                    </td>
                                    <td className="p-2">
                                        {user.uiks.map((uik) => uik.code).join(", ")}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </CardContent>
            </Card>

            {/* Пагинация */}
            {totalPages > 1 && (
                <div className="flex gap-2 justify-center mt-4">
                    <Button
                        onClick={() => loadData(Math.max(0, skip - take))}
                        disabled={loading || skip === 0}
                    >
                        {loading && skip > 0 ? <Loader2 className="animate-spin w-4 h-4 mr-1 inline" /> : null}
                        Назад
                    </Button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <Button
                            key={i}
                            onClick={() => loadData(i * take)}
                            variant={i === skip / take ? "default" : "outline"}
                            disabled={loading}
                        >
                            {i + 1}
                        </Button>
                    ))}
                    <Button
                        onClick={() =>
                            loadData(Math.min(skip + take, (totalPages - 1) * take))
                        }
                        disabled={loading || skip + take >= userStats!.totalAgitators}
                    >
                        {loading && skip + take < userStats!.totalAgitators ? (
                            <Loader2 className="animate-spin w-4 h-4 mr-1 inline" />
                        ) : null}
                        Вперед
                    </Button>
                </div>
            )}
        </div>
    );
}
