import { api } from "../libs/axios";
import { Book, BookForm } from "../models/book";

export class BookService {
    static async get(): Promise<Book[]> {
        try {
            const res = await api.get("/api/books/");
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