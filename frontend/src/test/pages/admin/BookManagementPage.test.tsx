import { render, screen, fireEvent } from '@testing-library/react';
import BookManagementPage from '@/view/admin/BookManagementPage';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import * as originalHook from '@/viewmodels/admin/useBookManagement';
import { BookService } from '@/services/book.service';
import { Book } from '@/models/book';

beforeAll(() => {
  if (!window.HTMLElement.prototype.scrollTo) {
    window.HTMLElement.prototype.scrollTo = () => { };
  }
});

vi.mock('@/viewmodels/admin/useBookManagement', () => ({
  useBookManagement: () => ({
    state: {
      books: [
        { id: 1, title: 'Clean Code', author: 'Robert Martin', genre: 'Tech', format: 'Physic', availability: true, pubDate: '2008-01-01', description: '', imageBase64: '' },
        { id: 2, title: 'The Pragmatic Programmer', author: 'Andrew Hunt', genre: 'Tech', format: 'Physic', availability: true, pubDate: '1999-01-01', description: '', imageBase64: '' },
        { id: 3, title: 'Design Patterns', author: 'Erich Gamma', genre: 'Tech', format: 'Physic', availability: false, pubDate: '1994-01-01', description: '', imageBase64: '' },
        { id: 4, title: 'Refactoring', author: 'Martin Fowler', genre: 'Tech', format: 'Physic', availability: true, pubDate: '1999-01-01', description: '', imageBase64: '' },
        { id: 5, title: 'Clean Architecture', author: 'Robert Martin', genre: 'Tech', format: 'Physic', availability: true, pubDate: '2017-01-01', description: '', imageBase64: '' },
      ],
      totalPages: 1,
      currentPage: 1,
      inputSearchTerm: '',
      bookFormModal: { type: null, info: null },
      removeConfirmation: { id: null, visible: false },
    },
    setters: {
      setInputSearchTerm: vi.fn(),
      setCurrentPage: vi.fn(),
      setBookFormModal: vi.fn(),
      setRemoveConfirmation: vi.fn(),
    },
    handlers: {
      onInputKeyUp: vi.fn(),
      applyBookChange: vi.fn(),
      removeBook: vi.fn(),
    },
  }),
}));

describe('BookManagementPage', () => {
  it('renderiza o título e botão "Add Book"', () => {
    render(<BookManagementPage />);
    expect(screen.getByText('Manage Books')).toBeInTheDocument();
    expect(screen.getByText('Add Book')).toBeInTheDocument();
  });

  it('renderiza a tabela com todos os livros simulados', () => {
    render(<BookManagementPage />);

    expect(screen.getAllByText('Clean Code').length).toBeGreaterThan(0);
    expect(screen.getAllByText('The Pragmatic Programmer').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Design Patterns').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Refactoring').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Clean Architecture').length).toBeGreaterThan(0);

    expect(screen.getAllByText('Robert Martin').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Andrew Hunt').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Erich Gamma').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Martin Fowler').length).toBeGreaterThan(0);

    expect(screen.getAllByText('Tech').length).toBeGreaterThanOrEqual(5);
  });


  it('abre o modal de adicionar livro ao clicar no botão e mostra "Add New Book"', () => {
    // Mock inicial do estado do modal
    let modalState: { type: "edit" | "add" | null; info: Book | null } = { type: null, info: null };

    // Mock dos livros para o estado
    const booksMock: Book[] = [
      {
        id: 1,
        title: "Clean Code",
        author: "Robert Martin",
        format: "Physic",
        genre: "Tech",
        availability: true,
        pubDate: "2008-01-01",
        description: "Some description",
        imageBase64: "",
      },
    ];

    // Função para retornar o valor mockado do hook com o estado atual
    const getHookReturn = () => ({
      state: {
        books: booksMock,
        totalPages: 1,
        currentPage: 1,
        inputSearchTerm: "",
        bookFormModal: modalState,
        removeConfirmation: { visible: false, id: null },
      },
      setters: {
        setInputSearchTerm: vi.fn(),
        setCurrentPage: vi.fn(),
        setBookFormModal,
        setRemoveConfirmation: vi.fn(),
      },
      handlers: {
        onInputKeyUp: vi.fn(),
        applyBookChange: vi.fn(),
        removeBook: vi.fn(),
      },
    });

    // Setter mock que atualiza o estado e força rerender do componente
    const setBookFormModal = (type: "edit" | "add" | null, info: Book | null = null) => {
      modalState = { type, info };
      spy.mockReturnValue(getHookReturn());
      rerender(<BookManagementPage />);
    };

    // Espia o hook original e aplica mock com estado inicial
    const spy = vi.spyOn(originalHook, 'useBookManagement').mockReturnValue(getHookReturn());

    // Renderiza o componente e guarda a função rerender para atualizar o DOM
    const { rerender } = render(<BookManagementPage />);

    // Simula o clique no botão para abrir o modal de adicionar livro
    fireEvent.click(screen.getByText('Add Book'));

    // Verifica se o modal com o texto "Add New Book" está visível no DOM
    expect(screen.getByText('Add New Book')).toBeInTheDocument();

    spy.mockRestore();
  });

  it('abre o modal de edição ao clicar no botão Edit', () => {
    const setBookFormModal = vi.fn();

    vi.spyOn(originalHook, 'useBookManagement').mockReturnValue({
      state: {
        books: [
          {
            id: 1,
            title: 'Clean Code', author: 'Robert Martin',
            format: 'Physic',
            genre: 'Tech',
            availability: true,
            pubDate: '2008',
            description: 'Some description',
            imageBase64: '',
          },
        ],
        totalPages: 1,
        currentPage: 1,
        inputSearchTerm: '',
        bookFormModal: { type: null, info: null },
        removeConfirmation: { id: null, visible: false },
      },
      setters: {
        setInputSearchTerm: vi.fn(),
        setCurrentPage: vi.fn(),
        setBookFormModal,
        setRemoveConfirmation: vi.fn(),
      },
      handlers: {
        onInputKeyUp: vi.fn(),
        applyBookChange: vi.fn(),
        removeBook: vi.fn(),
      },
    });

    render(<BookManagementPage />);
    fireEvent.click(screen.getAllByText('Edit')[0]);
    expect(setBookFormModal).toHaveBeenCalledWith(
      'edit',
      {
        author: 'Robert Martin',
        availability: true,
        description: 'Some description',
        format: 'Physic',
        genre: 'Tech',
        id: 1,
        imageBase64: '',
        pubDate: '2008',
        title: 'Clean Code',
      }
    );

  });

  it('mostra o botão Confirm após clicar em Remove', () => {
    const setRemoveConfirmation = vi.fn();

    vi.spyOn(originalHook, 'useBookManagement').mockReturnValueOnce({
      state: {
        books: [
          {
            id: 1,
            title: 'Clean Code',
            author: 'Robert Martin',
            format: 'Physic',
            genre: 'Tech',
            availability: true,
            pubDate: '2008',
            description: 'Some description',
            imageBase64: '',
          },
        ],
        totalPages: 1,
        currentPage: 1,
        inputSearchTerm: '',
        bookFormModal: { type: null, info: null },
        removeConfirmation: { id: null, visible: false },
      },
      setters: {
        setInputSearchTerm: vi.fn(),
        setCurrentPage: vi.fn(),
        setBookFormModal: vi.fn(),
        setRemoveConfirmation,
      },
      handlers: {
        onInputKeyUp: vi.fn(),
        applyBookChange: vi.fn(),
        removeBook: vi.fn(),
      },
    });

    const { rerender } = render(<BookManagementPage />);

    fireEvent.click(screen.getAllByText('Remove')[0]);

    vi.spyOn(originalHook, 'useBookManagement').mockReturnValueOnce({
      state: {
        books: [
          {
            id: 1,
            title: 'Clean Code',
            author: 'Robert Martin',
            format: 'Physic',
            genre: 'Tech',
            availability: true,
            pubDate: '2008',
            description: 'Some description',
            imageBase64: '',
          },
        ],
        totalPages: 1,
        currentPage: 1,
        inputSearchTerm: '',
        bookFormModal: { type: null, info: null },
        removeConfirmation: { id: 1, visible: true },
      },
      setters: {
        setInputSearchTerm: vi.fn(),
        setCurrentPage: vi.fn(),
        setBookFormModal: vi.fn(),
        setRemoveConfirmation,
      },
      handlers: {
        onInputKeyUp: vi.fn(),
        applyBookChange: vi.fn(),
        removeBook: vi.fn(),
      },
    });

    rerender(<BookManagementPage />);
    expect(screen.getAllByText('Confirm')[0]).toBeInTheDocument();
  });


  it('filtra livros ao buscar "Clean Code"', () => {
    render(<BookManagementPage />);


    vi.spyOn(BookService, 'search').mockImplementation(async (query) => {
      if (query.includes('Clean Code')) {
        return [
          {
            id: 1,
            title: 'Clean Code',
            author: 'Robert Martin',
            genre: 'Tech',
            format: 'Physic',
            availability: true,
            pubDate: '2008-01-01',
            description: '',
            imageBase64: '',
          },
        ];
      }
      return [];
    });
    const searchInput = screen.getByPlaceholderText(/search by title, author or genre/i);
    fireEvent.change(searchInput, { target: { value: 'Clean Code' } });
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(screen.getAllByText('Clean Code').length).toBeGreaterThan(0);
    expect(screen.queryAllByText('The Pragmatic Programmer')).toHaveLength(0);
    expect(screen.queryAllByText('Design Patterns')).toHaveLength(0);
    expect(screen.queryAllByText('Refactoring')).toHaveLength(0);
    expect(screen.queryAllByText('Clean Architecture')).toHaveLength(0);
  });


});