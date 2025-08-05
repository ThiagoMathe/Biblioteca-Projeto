import { api } from "../libs/axios";
import { DashboardData } from "../models/dashboard";

export class dashboardService {
    static async get(page = 1): Promise<DashboardData> {
        try {
            const res = await api.get("/api/dashboard/", { params: { page } });
            return res.data;
        } catch (err: any) {
            throw new Error(err.response?.data?.error || "Fetch failed");
        }
    }
}