// ─── Analytics API types ─────────────────────────────────────────────────────

export interface DailyStatPoint {
    date: string;   // "YYYY-MM-DD"
    clicks: number;
}

export interface MovingAvgPoint {
    date: string;
    clicks: number;
    moving_avg: number;
}

export interface LinkAnalytics {
    link: {
        id: string;
        label: string | null;
        url: string;
        slug: string | null;
    };
    analytics: {
        todayClicks: number;
        total7DayClicks: number;
        movingAvg7Day: number;
        isTrending: boolean;
        score: number;
        isTopLink: boolean;
        last7Days: DailyStatPoint[];
        movingAvgHistory: MovingAvgPoint[];
    };
}
