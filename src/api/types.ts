export interface StatsQuery {
    skip?: number;
    take?: number;
    coordinatorId?: number;
    uikFilter?: number[];
    dateFrom?: string;
    dateTo?: string;
}
