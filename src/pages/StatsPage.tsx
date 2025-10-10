import { useEffect, useState } from "react";
import { api } from "@/api/axios";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

interface AggregateUser {
    userId: number;
    _sum: { votersAdded: number };
    user?: {
        id: number;
        firstName: string;
        lastName: string
        phone: string
    };
}

interface AggregateUik {
    uikCode: number;
    _sum: { votersAdded: number };
    uik?: { name: string };
}

export default function StatsPage() {
    const [userStats, setUserStats] = useState<AggregateUser[]>([]);
    const [uikStats, setUikStats] = useState<AggregateUik[]>([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const loadData = async () => {
        try {
            setLoading(true);
            const [usersRes, uiksRes] = await Promise.all([
                api.get("/stats/aggregate?type=user"),
                api.get("/stats/aggregate?type=uik"),
                api.get("/stats/all"),
            ]);
            setUserStats(usersRes.data);
            setUikStats(uiksRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const COLORS = [
        "#60a5fa",
        "#34d399",
        "#fbbf24",
        "#f87171",
        "#a78bfa",
        "#f472b6",
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">📊 Статистика агитаторов</h1>
                <Button onClick={loadData} disabled={loading}>
                    {loading ? "Загрузка..." : "Обновить"}
                </Button>
            </div>

            {/* 🔎 Фильтры по датам */}
            <Card>
                <CardHeader>
                    <CardTitle>Фильтр по датам</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4 items-center">
                    <div className="flex flex-col">
                        <label className="text-sm text-muted-foreground">Начало</label>
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-44"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm text-muted-foreground">Конец</label>
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-44"
                        />
                    </div>
                    <Button
                        onClick={() => console.log({ startDate, endDate })}
                        variant="outline"
                        className={`text-white`}
                    >
                        Применить
                    </Button>
                </CardContent>
            </Card>

            {/* 📈 График по агитаторам */}
            <Card>
                <CardHeader>
                    <CardTitle>Активность агитаторов</CardTitle>
                </CardHeader>
                <CardContent>
                    {userStats.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                            Нет данных для отображения
                        </p>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={userStats.map((u) => ({
                                name: `${u.user?.firstName} ${u.user?.lastName}`,
                                voters: u._sum.votersAdded,
                            }))}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="voters" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>

            {/* 🥧 График по УИКам */}
            <Card>
                <CardHeader>
                    <CardTitle>Распределение по УИКам</CardTitle>
                </CardHeader>
                <CardContent>
                    {uikStats.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                            Нет данных
                        </p>
                    ) : (
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={uikStats.map((u) => ({
                                        name: `УИК ${u.uikCode}`,
                                        value: u._sum.votersAdded,
                                    }))}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={120}
                                    fill="#8884d8"
                                    label
                                >
                                    {uikStats.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>

            {/* 📋 Таблица агитаторов */}
            <Card>
                <CardHeader>
                    <CardTitle>Подробная таблица</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="min-w-full border-collapse">
                        <thead>
                        <tr className="text-left text-sm border-b">
                            <th className="p-2">№</th>
                            <th className="p-2">Имя</th>
                            <th className="p-2">Количество избирателей</th>
                        </tr>
                        </thead>
                        <tbody>
                        {userStats.map((u, idx) => (
                            <tr key={u.userId} className="border-b hover:bg-muted/30">
                                <td className="p-2">{idx + 1}</td>
                                <td className="p-2">
                                    {u.user?.firstName ?? "Агитатор"} {u.user?.lastName ?? ""}
                                </td>
                                <td className="p-2 font-medium">{u._sum.votersAdded}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
