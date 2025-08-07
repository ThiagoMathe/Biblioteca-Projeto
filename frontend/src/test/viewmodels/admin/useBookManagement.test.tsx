import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BookService } from '@/services/book.service';
import { useBookManagement } from '@/viewmodels/admin/useBookManagement';
import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import Swal from 'sweetalert2';
import { Book } from '@/models/book';

vi.mock('sweetalert2', () => ({
    default: {
        fire: vi.fn(),
    },
}));

vi.mock('@/services/book.service', () => ({
    BookService: {
        get: vi.fn(),
        search: vi.fn(),
        delete: vi.fn(),
    },
}));

const mockBooks: Book[] = [
    {
        id: 1,
        title: 'Clean Code',
        author: 'Robert Martin',
        description: 'Livro sobre boas práticas de código limpo',
        genre: 'Tech',
        format: 'Physic',
        pubDate: "2008-01-01",
        availability: true,
        imageBase64: '',
    },
    {
        id: 2,
        title: 'Refactoring',
        author: 'Martin Fowler',
        description: 'Livro sobre refatoração de código',
        genre: 'Tech',
        format: 'Physic',
        pubDate: "2008-01-01",
        availability: true,
        imageBase64: '',
    },
];

describe('useBookManagement', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve buscar livros na montagem (sem termo de busca)', async () => {
        (BookService.get as any).mockResolvedValueOnce({ books: mockBooks, totalPages: 2 });

        const { result } = renderHook(() => useBookManagement());

        await waitFor(() => {
            expect(result.current.state.books).toEqual(mockBooks);
        });

        expect(BookService.get).toHaveBeenCalledWith(1);
        expect(result.current.state.totalPages).toBe(2);
    });

    it('deve remover um livro corretamente', async () => {
        const bookIdToDelete = 1;

        (BookService.get as any).mockResolvedValueOnce({ books: mockBooks, totalPages: 1 });
        (BookService.delete as any).mockResolvedValueOnce({ id: bookIdToDelete });

        const { result } = renderHook(() => useBookManagement());

        await waitFor(() => {
            expect(result.current.state.books.length).toBeGreaterThan(0);
        });

        await act(async () => {
            await result.current.handlers.removeBook(bookIdToDelete);
        });

        expect(BookService.delete).toHaveBeenCalledWith(bookIdToDelete);
        expect(Swal.fire).toHaveBeenCalledWith(
            expect.objectContaining({
                icon: 'success',
                title: 'Deleted!',
            })
        );
        expect(result.current.state.books.some(b => b.id === bookIdToDelete)).toBe(false);
    });

    it('deve lidar com erro ao remover livro', async () => {
        // Simula resposta do serviço GET com livros mockados
        (BookService.get as any).mockResolvedValueOnce({ books: mockBooks, totalPages: 1 });

        // Simula falha na requisição DELETE (remoção de livro)
        (BookService.delete as any).mockRejectedValueOnce(new Error('erro'));

        // Renderiza o hook personalizado
        const { result } = renderHook(() => useBookManagement());

        // Aguarda carregamento inicial dos livros
        await waitFor(() => {
            expect(result.current.state.books.length).toBeGreaterThan(0);
        });

        // Tenta remover o livro com ID 1
        await act(async () => {
            await result.current.handlers.removeBook(1);
        });

        // Verifica se o alerta de erro do SweetAlert foi chamado
        expect(Swal.fire).toHaveBeenCalledWith(
            expect.objectContaining({
                icon: 'error',
                title: 'Oops...',
            })
        );

        // Verifica se o serviço de remoção foi chamado com o ID correto
        expect(BookService.delete).toHaveBeenCalledWith(1);

        // Garante que os livros não foram alterados após a falha
        expect(result.current.state.books).toEqual(mockBooks);
    });

    it('deve aplicar uma alteração no livro', async () => {
        // Simula resposta inicial com lista de livros
        (BookService.get as any).mockResolvedValueOnce({ books: mockBooks, totalPages: 1 });

        // Renderiza o hook personalizado
        const { result } = renderHook(() => useBookManagement());

        // Aguarda até que os livros sejam carregados
        await waitFor(() => {
            expect(result.current.state.books.length).toBeGreaterThan(0);
        });

        // Cria uma versão alterada do primeiro livro da lista
        const updatedBook = { ...mockBooks[0], title: 'Clean Code 2nd Ed' };

        // Aplica a alteração usando o handler
        await act(async () => {
            await result.current.handlers.applyBookChange(updatedBook);
        });

        // Verifica se a alteração foi refletida corretamente no estado
        expect(result.current.state.books.find(b => b.id === updatedBook.id)?.title).toBe('Clean Code 2nd Ed');
    });
});