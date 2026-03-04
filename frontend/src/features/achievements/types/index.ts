
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
    name: string;
    account_status: "active" | "suspended" | "deleted";
  };
  token?: string;
}
