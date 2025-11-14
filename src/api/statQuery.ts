import {api} from "@/api/axios.ts";
import type {StatsQuery} from "@/api/types.ts";


export const fetchAgitatorStats = async (query: StatsQuery) => {
    const params: Record<string, string> = {};

    if (query.skip !== undefined) params.skip = String(query.skip);
    if (query.take !== undefined) params.take = String(query.take);
    if (query.coordinatorId !== undefined) params.coordinatorId = String(query.coordinatorId);
    if (query.uikFilter && query.uikFilter.length) params.uikFilter = query.uikFilter.join(",");
    if (query.dateFrom) params.dateFrom = query.dateFrom;
    if (query.dateTo) params.dateTo = query.dateTo;

    const { data } = await api.get("/stats/getStat", { params });
    return data;
};