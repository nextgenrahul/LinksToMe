import { RequestHandler } from "express";


export interface Route {
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  path: string;
  preValidation?: RequestHandler;
  preHandler?: RequestHandler;
  handler: RequestHandler;
}