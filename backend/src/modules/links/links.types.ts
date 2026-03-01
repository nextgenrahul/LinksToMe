import { RequestHandler } from "express";


export interface Route {
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  path: string;
  preValidation?: RequestHandler;
  preHandler?: RequestHandler;
  handler: RequestHandler;
}



export interface LinkRow {
    id: string;
    user_id: string;
    label: string | null;
    url: string;
    slug: string | null;
    position: number;
    created_at: Date;
}

export interface DailyStatRow {
    date: string;
    clicks: number;
}

export interface MovingAvgRow {
    date: string;
    clicks: number;
    moving_avg: number;
}