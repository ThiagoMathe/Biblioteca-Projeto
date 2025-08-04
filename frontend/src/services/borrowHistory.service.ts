import { api } from "../libs/axios";
import { Borrow } from "../models/borrow";

type PaginatedBorrowResponse = {
  history: Borrow[];
  currentPage: number;
  totalPages: number;
};

export class BorrowHistoryService {
  static async get(page = 1): Promise<PaginatedBorrowResponse> {
    try {
      const res = await api.get("/api/borrow/", { params: { page } });
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Fetch failed");
    }
  }

  static async search(term: string): Promise<Borrow[]> {
    try {
      const res = await api.get("/api/borrow/search", { params: { query: term } });
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Fetch failed");
    }
  }

  static async borrow(userId: number, bookId: number, dias: number): Promise<{ message: string }> {
    try {
      const res = await api.post("/api/borrow/borrow", { userId, bookId, dias });
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Borrow failed");
    }
  }

  static async return(borrowId: number): Promise<{ message: string }> {
    try {
      const res = await api.patch(`/api/borrow/return/${borrowId}`);
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Return failed");
    }
  }

  static async getByUser(userId: number): Promise<Borrow[]> {
    try {
      const res = await api.get(`/api/borrow/user/${userId}`);
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Fetch failed");
    }
  }

  static async getActive(): Promise<Borrow[]> {
    try {
      const res = await api.get("/api/borrow/active");
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Fetch failed");
    }
  }

  static async markLate(): Promise<{ message: string }> {
    try {
      const res = await api.patch("/api/borrow/mark-late");
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Update failed");
    }
  }
}