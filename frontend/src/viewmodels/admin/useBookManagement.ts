import { useEffect, useReducer, useState } from "react";
import { BookManagementReducer, initialBookManagementState } from "../../reducers/admin/BookManagementReducer";
import { Book } from "../../models/book";
import { api } from "../../libs/axios";
import { BookService } from "../../services/book.service";
import Swal from "sweetalert2";


export const useBookManagement = () => {
  const [state, dispatch] = useReducer(BookManagementReducer, initialBookManagementState);
  const [inputSearchTerm, setInputSearchTerm] = useState("");

  const setSearchTerm = (term: string) => {
    dispatch({ type: "SET_SEARCH_TERM", payload: term });
  };

  const setSortConfig = (key: keyof Book) => {
    let direction: "asc" | "desc" = "asc";
    if (state.sortConfig?.key === key && state.sortConfig.direction === "asc") {
      direction = "desc";
    }
    dispatch({ type: "SET_SORT_CONFIG", payload: { key, direction } });
  };

  const setCurrentPage = (page: number) => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: page });
  };

  /* mudar // get da api */
  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchTerm(inputSearchTerm.trim());
    }
  };

  const setBookFormModal = (type: "edit" | "add" | null, info: Book | null = null) => {
    dispatch({ type: "SET_BOOK_FORM_MODAL", payload: { type, info } })
  }

  const setRemoveBook = (visible: false | true, id: number | null = null) => {
    dispatch({ type: "SET_REMOVE_BOOK", payload: { visible, id } })
  }

  const handleRemove = async (id: number) => {
    try {
      const res = await BookService.delete(id);
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'The book was successfully deleted.',
        showConfirmButton: false,
        timer: 1500,
      });
      const updatedBooks = state.books.filter(book => book.id !== res.id);
      dispatch({ type: "SET_BOOKS", payload: updatedBooks })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to delete the book.',
      });
    }
  }

  const applyBookChange = (book: Book) => {
    const updatedBooks = [...state.books.filter(b => b.id !== book.id), book];
    dispatch({ type: "SET_BOOKS", payload: updatedBooks });
  };

  useEffect(() => {
    const sortedBooks = state.sortConfig
      ? [...state.books].sort((a, b) => {
        const aVal = a[state.sortConfig!.key]?.toString().toLowerCase() ?? "";
        const bVal = b[state.sortConfig!.key]?.toString().toLowerCase() ?? "";
        if (aVal < bVal) return state.sortConfig!.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return state.sortConfig!.direction === "asc" ? 1 : -1;
        return 0;
      })
      : state.books;

    dispatch({ type: "SET_BOOKS", payload: sortedBooks });
  }, [state.sortConfig])


  useEffect(() => {
    const fetchBooks = async () => {
      try {
        let res: Book[];
        if (state.searchTerm.trim() === "") {
          res = await BookService.get();

        } else {
          /* mudar | criar rota do search */
          res = await api.get("/api/books/search", {
            params: { query: state.searchTerm }
          });
        }
        if (res)
          dispatch({ type: "SET_BOOKS", payload: res });
      } catch (error) {
        console.error("Error fetching books", error);
      }
    };

    fetchBooks();
  }, [state.currentPage, state.searchTerm]);

  return {
    books: state.books,
    totalPages: state.totalPages,
    sortConfig: state.sortConfig,
    currentPage: state.currentPage,
    inputSearchTerm,
    bookFormModal: state.bookFormModal,
    removeBook: state.removeBook,
    setInputSearchTerm,
    setSortConfig,
    setCurrentPage,
    onInputKeyDown,
    setBookFormModal,
    applyBookChange,
    setRemoveBook,
    handleRemove
  };
};