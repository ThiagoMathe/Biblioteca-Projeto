import { api } from "../libs/axios";
import { User } from "../models/user";

type PaginatedUsersResponse = {
    users: User[];
    currentPage: number;
    totalPages: number;
};

export class UserService {
    static async get(page = 1): Promise<PaginatedUsersResponse> {
        try {
            const res = await api.get("/api/users/", {
                params: { page }
            });
            return res.data;
        } catch (err: any) {
            throw new Error(err.response?.data?.error || "Fetch failed");
        }
    }

    static async search(query: string): Promise<User[]> {
        try {
            const res = await api.get("/api/users/search", {
                params: { query }
            });
            return res.data;
        } catch (err: any) {
            throw new Error(err.response?.data?.error || "Fetch failed");
        }
    }
}