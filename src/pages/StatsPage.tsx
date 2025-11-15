// src/pages/StatsPage.tsx
import type {JSX} from 'react'
import { useEffect, useMemo, useState} from "react";
import { api } from "@/api/axios";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import {MultiSelect} from "@/components/ui/multi-select"; // у тебя уже был такой компонент
import type { UIK, Voter } from "@/types/models";

type Coordinator = { id: number; firstName: string; lastName: string };
type UserRow = {
    id: number;
    name: string;
    coordinator: string | null;
    votersCount: number;
    voters: Voter[];
    uiks: UIK[];
};

type AggregateUser = {
    totalAgitators: number;
    totalVoters: number;
    data: UserRow[];
    skip: number;
    take: number;
};

function useDebounce<T>(value: T, delay = 300) {
    const [debounced, setDebounced] = useState<T>(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

export default function StatsPage() {
    // table data
    const [userStats, setUserStats] = useState<AggregateUser | null>(null);
    const [loading, setLoading] = useState(false);

    // filters
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [coordinatorId, setCoordinatorId] = useState<number | undefined>();
    const [uikFilter, setUikFilter] = useState<number[]>([]);

    // pagination state (page is 1-based)
    const [page, setPage] = useState<number>(1);
    const take = 50;

    // lists for selects
    const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
    const [uiksList, setUiksList] = useState<UIK[]>([]);
    const [loadingLists, setLoadingLists] = useState(false);

    // debounced filters — чтобы не дергать API на каждое изменение
    const debStart = useDebounce(startDate, 660);
    const debEnd = useDebounce(endDate, 650);
    const debCoordinator = useDebounce(coordinatorId, 600);
    const debUiks = useDebounce(uikFilter, 600);

    // when debounced filters changed -> reset to first page
    useEffect(() => {
        setPage(1);
        loadData(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debStart, debEnd, debCoordinator, debUiks]);

    // load select lists on mount
    useEffect(() => {
        (async () => {
            setLoadingLists(true);
            try {
                const [coordsRes, uiksRes] = await Promise.all([
                    api.get("/users/coordinators"), // endpoint должен вернуть список координаторов
                    api.get("/uiks/"), // endpoint должен вернуть список уиков
                ]);
                setCoordinators(coordsRes.data || []);
                setUiksList(uiksRes.data || []);
            } catch (e) {
                console.error("Ошибка загрузки списков:", e);
            } finally {
                setLoadingLists(false);
            }
        })();
    }, []);

    // build params object to reuse
    const buildParams = (pageToLoad = page) => {
        const params: Record<string, string> = {
            skip: String((pageToLoad - 1) * take),
            take: String(take),
        };
        if (debStart) params.dateFrom = debStart;
        if (debEnd) params.dateTo = debEnd;
        if (debCoordinator) params.coordinatorId = String(debCoordinator);
        if (debUiks && debUiks.length) params.uikFilter = debUiks.join(",");
        return params;
    };

    // load data (page 1..N)
    async function loadData(pageToLoad?: number) {
        const p = pageToLoad ?? page;
        setLoading(true);
        try {
            const params = buildParams(p);
            const res = await api.get("/stats/getStat", { params });
            const payload: AggregateUser = res.data;
            // ensure skip/take are consistent
            payload.skip = Number(params.skip);
            payload.take = Number(params.take);
            setUserStats(payload);
            setPage(p);
            const el = document.getElementById("stats-table-top");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        } catch (err) {
            console.error("Ошибка загрузки статистики:", err);
        } finally {
            setLoading(false);
        }
    }

    // page count
    const totalPages = useMemo(() => {
        if (!userStats) return 0;
        return Math.max(1, Math.ceil(userStats.totalAgitators / take));
    }, [userStats, take]);

    // helper to render page buttons window (like GitHub)
    const renderPageButtons = () => {
        if (!totalPages) return null;
        const current = page;
        const delta = 2; // pages before/after current
        const range: number[] = [];
        for (let i = Math.max(1, current - delta); i <= Math.min(totalPages, current + delta); i++) {
            range.push(i);
        }
        const buttons: JSX.Element[] = [];

        // first
        if (range[0] > 1) {
            buttons.push(
                <Button key="p-first" variant="outline" onClick={() => loadData(1)} disabled={loading}>
                    1
                </Button>
            );
            if (range[0] > 2) buttons.push(<span key="dots-start" className="px-2">…</span>);
        }

        // range
        range.forEach((p) => {
            buttons.push(
                <Button
                    key={p}
                    variant={p === current ? "default" : "outline"}
                    onClick={() => loadData(p)}
                    disabled={loading}
                >
                    {p}
                </Button>
            );
        });

        // last
        if (range[range.length - 1] < totalPages) {
            if (range[range.length - 1] < totalPages - 1) buttons.push(<span key="dots-end" className="px-2">…</span>);
            buttons.push(
                <Button key="p-last" variant="outline" onClick={() => loadData(totalPages)} disabled={loading}>
                    {totalPages}
                </Button>
            );
        }

        return buttons;
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">📊 Статистика агитаторов</h1>
                <div className="flex items-center gap-2">
                    <Button onClick={() => { setPage(1); loadData(1); }} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2 inline" /> : null}
                        {loading ? "Загрузка..." : "Обновить"}
                    </Button>
                </div>
            </div>

            {/* Filters block */}
            <Card>
                <CardHeader>
                    <CardTitle>Фильтры</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4 items-end">
                    <div className="flex flex-col">
                        <label className="text-sm text-muted-foreground mb-1">Дата от</label>
                        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-44" />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm text-muted-foreground mb-1">Дата до</label>
                        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-44" />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm text-muted-foreground mb-1">Координатор</label>
                        <select
                            className="border rounded px-2 py-1 h-9"
                            value={coordinatorId ?? ""}
                            onChange={(e) => setCoordinatorId(e.target.value ? Number(e.target.value) : undefined)}
                            disabled={loadingLists}
                        >
                            <option value="">Все</option>
                            {coordinators.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.lastName} {c.firstName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1 min-w-[240px]">
                        <label className="text-sm text-muted-foreground mb-1 block">УИКы</label>
                        <MultiSelect
                            options={uiksList.map((u) => ({ label: `${u.code} — ${u.name}`, value: String(u.code) }))}
                            selected={uikFilter.map(String)}
                            onChange={(selected: string[]) => setUikFilter(selected.map(Number))}
                            placeholder="Выберите УИКы"
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={() => {
                                // clear filters
                                setStartDate("");
                                setEndDate("");
                                setCoordinatorId(undefined);
                                setUikFilter([]);
                                setPage(1);
                                loadData(1);
                            }}
                            variant="ghost"
                        >
                            Сбросить
                        </Button>
                        <Button
                            onClick={() => { setPage(1); loadData(1); }}
                            disabled={loading}
                        >
                            Применить
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <div id="stats-table-top" />
            <Card>
                <CardHeader className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <CardTitle>Подробная таблица</CardTitle>
                        <div className="text-sm">
                            <span className="mr-4">Агитаторов: <strong>{userStats?.totalAgitators ?? "-"}</strong></span>
                            <span>Избирателей: <strong>{userStats?.totalVoters ?? "-"}</strong></span>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin w-12 h-12 text-gray-500" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto border-collapse">
                                <thead>
                                <tr className="text-left text-sm border-b">
                                    <th className="p-2">№</th>
                                    <th className="p-2">ФИО</th>
                                    <th className="p-2">Координатор</th>
                                    <th className="p-2">Количество избирателей</th>
                                    <th className="p-2">UIK</th>
                                </tr>
                                </thead>
                                <tbody>
                                {userStats?.data.length ? (
                                    userStats.data.map((u, idx) => (
                                        <tr key={u.id} className="border-b hover:bg-muted/30">
                                            <td className="p-2">{(userStats.skip || 0) + idx + 1}</td>
                                            <td className="p-2">{u.name}</td>
                                            <td className="p-2">{u.coordinator ?? "—"}</td>
                                            <td className="p-2 font-medium">
                                                <Link to={`#`}>{u.votersCount}</Link>
                                            </td>
                                            <td className="p-2">{u.uiks.map(s => s.code).join(", ")}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="p-6 text-center text-muted-foreground">Нет данных</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                    <Button onClick={() => loadData(1)} disabled={loading || page === 1}>
                        {loading && page !== 1 ? <Loader2 className="animate-spin w-4 h-4 mr-1 inline" /> : null}
                        Первая
                    </Button>

                    <Button onClick={() => loadData(Math.max(1, page - 1))} disabled={loading || page === 1}>
                        {loading && page > 1 ? <Loader2 className="animate-spin w-4 h-4 mr-1 inline" /> : null}
                        Назад
                    </Button>

                    {renderPageButtons()}

                    <Button onClick={() => loadData(Math.min(totalPages, page + 1))} disabled={loading || page === totalPages}>
                        {loading && page < totalPages ? <Loader2 className="animate-spin w-4 h-4 mr-1 inline" /> : null}
                        Вперед
                    </Button>

                    <Button onClick={() => loadData(totalPages)} disabled={loading || page === totalPages}>
                        Последняя
                    </Button>
                </div>
            )}
        </div>
    );
}
