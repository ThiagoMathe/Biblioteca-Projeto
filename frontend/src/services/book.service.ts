import { api } from "../libs/axios";
import { Book, BookForm } from "../models/book";

type PaginatedBooksResponse = {
    books: Book[];
    currentPage: number;
    totalPages: number;
};

export class BookService {
    static async get(page = 1): Promise<PaginatedBooksResponse> {
        try {
            const res = await api.get("/api/books/", {
                params: { page }
            });
            return res.data;
        } catch (err: any) {
            throw new Error(err.response?.data?.error || "Fetch failed");
        }
    }

    static async search(query: string): Promise<Book[]> {
        try {
            const res = await api.get("/api/books/search", {
                params: { query }
            });
            return res.data;
        } catch (err: any) {
            throw new Error(err.response?.data?.error || "Fetch failed");
        }
    }

    static async add(bookData: BookForm): Promise<Book> {
        try {
            const res = await api.post("/api/books/", bookData);
            return res.data;
        } catch (err: any) {
            throw new Error(err.response?.data?.error || "Register failed");
        }
    }

    static async update(bookData: Book): Promise<Book> {
        try {
            const res = await api.put(`/api/books/${bookData.id}`, bookData);
            return res.data;
        } catch (err: any) {
            throw new Error(err.response?.data?.error || "Register failed");
        }
    }

    static async delete(id: number): Promise<Book> {
        try {
            const res = await api.delete(`/api/books/${id}`);
            return res.data;
        } catch (err: any) {
            throw new Error(err.response?.data?.error || "Register failed");
        }
    }
}