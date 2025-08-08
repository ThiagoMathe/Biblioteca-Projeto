import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import BookManagementPage from '@/view/admin/BookManagementPage';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { BookAction, BookManagementStateType } from '@/reducers/admin/BookManagementReducer';
import React, { act } from 'react';
import { Book } from '@/models/book';

beforeAll(() => {
  if (!window.HTMLElement.prototype.scrollTo) {
    window.HTMLElement.prototype.scrollTo = () => { };
  }
});

vi.mock('@/services/book.service.ts', () => ({
  BookService: {
    add: vi.fn().mockResolvedValue({
      id: 123,
      title: 'Dom Quixote',
      description: 'Livro clássico da literatura',
      author: 'Miguel de Cervantes',
      genre: 'Fiction',
      format: 'Hybrid',
      publicationDate: '2023-01-01',
      availability: true,
    }),
    update: vi.fn().mockResolvedValue({
      id: 1,
      title: 'Dom Quixote Editado',
      description: 'Descrição editada',
      author: 'Miguel de Cervantes',
      genre: 'Fiction',
      format: 'Physic',
      publicationDate: '2023-01-01',
      availability: true,
    }),
  },
}));



vi.mock("@/viewmodels/admin/useBookManagement", () => {
  return {
    useBookManagement: () => {
      const reducer = (state: BookManagementStateType, action: BookAction) => {
        switch (action.type) {
          case "SET_BOOKS":
            return { ...state, books: action.payload };
          case "SET_BOOK_FORM_MODAL":
            return { ...state, bookFormModal: action.payload };
          case "SET_REMOVE_CONFIRMATION":
            return { ...state, removeConfirmation: action.payload };
          default:
            return state;
        }
      };

      const initialState: BookManagementStateType = {
        books: [
          { id: 1, title: 'Clean Code', author: 'Robert Martin', genre: 'Tech', format: 'Physic', availability: true, pubDate: '2008-01-01', description: '', imageBase64: '' },
          { id: 2, title: 'The Pragmatic Programmer', author: 'Andrew Hunt', genre: 'Tech', format: 'Physic', availability: true, pubDate: '1999-01-01', description: '', imageBase64: '' },
          { id: 3, title: 'Design Patterns', author: 'Erich Gamma', genre: 'Tech', format: 'Physic', availability: false, pubDate: '1994-01-01', description: '', imageBase64: '' },
          { id: 4, title: 'Refactoring', author: 'Martin Fowler', genre: 'Tech', format: 'Physic', availability: true, pubDate: '1999-01-01', description: '', imageBase64: '' },
          { id: 5, title: 'Clean Architecture', author: 'Robert Martin', genre: 'Tech', format: 'Physic', availability: true, pubDate: '2017-01-01', description: '', imageBase64: '' },
        ],
        totalPages: 1,
        currentPage: 1,
        searchTerm: "",
        bookFormModal: { type: null, info: null },
        removeConfirmation: { id: null, visible: false },
      };

      const [state, dispatch] = React.useReducer(reducer, initialState);

      const setBookFormModal = (type: "add" | "edit" | null, info = null) => {
        dispatch({ type: "SET_BOOK_FORM_MODAL", payload: { type, info } });
      };

      const setRemoveConfirmation = (visible: boolean, id: number | null = null) => {
        dispatch({ type: "SET_REMOVE_CONFIRMATION", payload: { visible, id } });
      };


      const applyBookChange = (book: Book) => {
        console.log("bookchange")
        const updatedBooks = [book, ...state.books.filter(b => b.id !== book.id)];
        dispatch({ type: "SET_BOOKS", payload: updatedBooks });
      };

      return {
        state,
        setters: {
          setBookFormModal,
          setInputSearchTerm: vi.fn(),
          setCurrentPage: vi.fn(),
          setRemoveConfirmation,
        },
        handlers: {
          onInputKeyUp: vi.fn(),
          applyBookChange,
          removeBook: vi.fn(),
        },
      };
    },
  };
});

describe('BookManagementPage', () => {
  it('renderiza a tabela com todos os livros simulados', () => {
    render(<BookManagementPage />);

    expect(screen.getAllByText('Clean Code').length).toBeGreaterThan(0);
    expect(screen.getAllByText('The Pragmatic Programmer').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Design Patterns').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Refactoring').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Clean Architecture').length).toBeGreaterThan(0);
  });

  // mudar aqui!
  it('abre o modal de adicionar livro ao clicar no botão e mostra "Add New Book", depois o livro é lançado!', async () => {
    // Renderiza a página de gerenciamento de livros
    render(<BookManagementPage />);

    // Clica no botão "Add Book" para abrir o modal de adição
    const button = screen.getByRole('button', { name: /add book/i });
    fireEvent.click(button);

    // Espera o título do modal aparecer para confirmar que abriu
    const h2 = await screen.findByRole('heading', { name: /add new book/i });
    expect(h2).toBeInTheDocument();

    // Preenche o formulário com os dados do novo livro
    const titleInput = await screen.findByLabelText(/title/i);
    fireEvent.change(titleInput, { target: { value: 'Dom Quixote' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Livro clássico da literatura' } });
    fireEvent.change(screen.getByLabelText(/author/i), { target: { value: 'Miguel de Cervantes' } });
    fireEvent.change(screen.getByLabelText(/genre/i), { target: { value: 'Fiction' } });
    fireEvent.change(screen.getByLabelText(/format/i), { target: { value: 'Hybrid' } });
    fireEvent.change(screen.getByLabelText(/publication date/i), { target: { value: '2023-01-01' } });

    // Localiza o container correto que tem o botão "Add Book" e "Cancel"
    const sections = screen.getAllByText(/add book/i).map(el => el.closest('div'));
    const correctSection = sections.find(div =>
      within(div!).queryByRole('button', { name: /cancel/i })
    );

    // Clica no botão "Add Book" dentro do modal para submeter o formulário
    const addBookButton = within(correctSection!).getByRole('button', { name: /add book/i });
    fireEvent.click(addBookButton);

    // Espera o livro aparecer na lista
    await waitFor(() => {
      const livros = screen.getAllByText('Dom Quixote');
      expect(livros.length).toBeGreaterThan(0);
    });
  });


  it('abre o modal de editar livro ao clicar no botão "Edit" e atualiza o livro', async () => {
    render(<BookManagementPage />);

    await act(async () => {
      fireEvent.click(screen.getAllByText(/edit/i)[0]);
    });

    const h2 = await screen.findByRole('heading', { name: /edit book/i });
    expect(h2).toBeInTheDocument();

    fireEvent.change(await screen.findByLabelText(/title/i), { target: { value: 'Dom Quixote Editado' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Descrição editada' } });
    fireEvent.change(screen.getByLabelText(/author/i), { target: { value: 'Miguel de Cervantes' } });
    fireEvent.change(screen.getByLabelText(/genre/i), { target: { value: 'Fiction' } });
    fireEvent.change(screen.getByLabelText(/format/i), { target: { value: 'Physic' } });
    fireEvent.change(screen.getByLabelText(/publication date/i), { target: { value: '2023-01-01' } });

    const sections = screen.getAllByText(/edit/i).map(el => el.closest('div'));
    const correctSection = sections.find(div =>
      within(div!).queryByRole('button', { name: /cancel/i })
    );

    await act(async () => {
      const editButton = within(correctSection!).getByRole('button', { name: /edit/i });
      fireEvent.click(editButton);
    });

    await waitFor(() => {
      const livros = screen.getAllByText('Dom Quixote Editado');
      expect(livros.length).toBeGreaterThan(0);
    });
  });

  // mudar: tem que mockar o retorno, onInputKEyUp e setBookFormModal
  /*  it('filtra livros ao buscar "Clean Code"', async () => {
     render(<BookManagementPage />);
     const searchInput = screen.getByPlaceholderText(/search by title, author or genre/i);
     fireEvent.change(searchInput, { target: { value: 'Clean Code' } });
     fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter', charCode: 13 });
 
     // Aguarde resultados renderizarem se for async
     const cleanCodeBooks = await screen.findAllByText('Clean Code');
     expect(cleanCodeBooks.length).toBeGreaterThan(0);
     // tem que mockar a api! pra retornar somente o livro que parece!
 
     // Garantir que os outros livros não aparecem
     expect(screen.queryByText('The Pragmatic Programmer')).toBeNull();
     expect(screen.queryByText('Design Patterns')).toBeNull();
     expect(screen.queryByText('Refactoring')).toBeNull();
     expect(screen.queryByText('Clean Architecture')).toBeNull();
   }); */
});