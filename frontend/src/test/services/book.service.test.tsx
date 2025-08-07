import { describe, it, expect, vi, beforeEach } from "vitest";
import { BookService } from "@/services/book.service";
import { api } from "@/libs/axios";
import { Book, BookForm } from "@/models/book";

vi.mock("@/libs/axios.ts", () => ({
    api: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

describe("BookService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("get() deve chamar api.get com a página e retornar dados", async () => {
        const mockData = {
            books: [{ id: 1, title: "Livro 1", author: "Autor 1" }],
            currentPage: 2,
            totalPages: 5,
        };
        (api.get as any).mockResolvedValueOnce({ data: mockData });

        const result = await BookService.get(2);

        expect(api.get).toHaveBeenCalledWith("/api/books/", { params: { page: 2 } });
        expect(result).toEqual(mockData);
    });

    it("search() deve chamar api.get com o query e retornar livros", async () => {
        const mockBooks = [{ id: 1, title: "Clean Code", author: "Robert Martin" }];
        (api.get as any).mockResolvedValueOnce({ data: mockBooks });

        const result = await BookService.search("Clean");

        expect(api.get).toHaveBeenCalledWith("/api/books/search", { params: { query: "Clean" } });
        expect(result).toEqual(mockBooks);
    });

    it("add() deve chamar api.post e retornar livro criado", async () => {
        const newBook: BookForm = {
            title: "Novo Livro",
            author: "Autor Novo",
            description: "",
            genre: "Tech",
            format: "Physic",
            availability: true,
            pubDate: "2024-01-01",
            imageBase64: "",
        };
        const createdBook = { id: 10, ...newBook };
        (api.post as any).mockResolvedValueOnce({ data: createdBook });

        const result = await BookService.add(newBook);

        expect(api.post).toHaveBeenCalledWith("/api/books/", newBook);
        expect(result).toEqual(createdBook);
    });

    it("update() deve chamar api.put e retornar livro atualizado", async () => {
        const bookToUpdate: Book = {
            id: 5,
            title: "Atualizado",
            author: "Autor Atual",
            description: "",
            genre: "Tech",
            format: "Physic",
            availability: true,
            pubDate: "2024-01-01",
            imageBase64: "",
        };
        (api.put as any).mockResolvedValueOnce({ data: bookToUpdate });

        const result = await BookService.update(bookToUpdate);

        expect(api.put).toHaveBeenCalledWith(`/api/books/${bookToUpdate.id}`, bookToUpdate);
        expect(result).toEqual(bookToUpdate);
    });

    it("delete() deve chamar api.delete e retornar livro deletado", async () => {
        // Mock do livro que será retornado após a exclusão
        const deletedBook = { id: 5, title: "Deletado", author: "Autor" };

        // Mock da resposta da API para a chamada delete, simulando sucesso
        (api.delete as any).mockResolvedValueOnce({ data: deletedBook });

        // Chama a função delete do serviço para o livro com id 5
        const result = await BookService.delete(5);

        // Verifica se a função api.delete foi chamada com a URL correta
        expect(api.delete).toHaveBeenCalledWith(`/api/books/5`);

        // Verifica se o resultado retornado é o livro que foi "deletado"
        expect(result).toEqual(deletedBook);
    });

    // Testa a função get do BookService para tratar erro de chamada
    it("get() deve lançar erro quando a chamada falhar", async () => {
        // Mock da resposta da API simulando uma falha na chamada get
        (api.get as any).mockRejectedValueOnce({
            response: { data: { error: "Erro de fetch" } },
        });

        // Espera que a chamada BookService.get() rejeite a promise lançando o erro esperado
        await expect(BookService.get()).rejects.toThrow("Erro de fetch");
    });
});