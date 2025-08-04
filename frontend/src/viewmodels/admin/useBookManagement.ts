import { useEffect, useReducer, useState } from "react";
import { BookManagementReducer, initialBookManagementState } from "../../reducers/admin/BookManagementReducer";
import { Book } from "../../models/book";
import { BookService } from "../../services/book.service";
import Swal from "sweetalert2";

export const useBookManagement = () => {
  const [state, dispatch] = useReducer(BookManagementReducer, initialBookManagementState);
  const [inputSearchTerm, setInputSearchTerm] = useState("");

  // SETTERS
  const setCurrentPage = (page: number) => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: page });
  };

  const setBookFormModal = (type: "edit" | "add" | null, info: Book | null = null) => {
    dispatch({ type: "SET_BOOK_FORM_MODAL", payload: { type, info } });
  };

  const setRemoveConfirmation = (visible: boolean, id: number | null = null) => {
    dispatch({ type: "SET_REMOVE_CONFIRMATION", payload: { visible, id } });
  };

  //  HANDLERS 
  const onInputKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentValue = e.currentTarget.value;

    if (e.key === "Enter") {
      dispatch({ type: "SET_SEARCH_TERM", payload: inputSearchTerm.trim() });
    } else if (e.key === "Backspace" && currentValue.length === 0) {
      dispatch({ type: "SET_SEARCH_TERM", payload: "" });
    }
  };

  const applyBookChange = (book: Book) => {
    const updatedBooks = [book, ...state.books.filter(b => b.id !== book.id)];
    dispatch({ type: "SET_BOOKS", payload: updatedBooks });
  };

  const removeBook = async (id: number) => {
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
      dispatch({ type: "SET_BOOKS", payload: updatedBooks });
      setRemoveConfirmation(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to delete the book.',
      });
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        let books: Book[];
        if (state.searchTerm.trim() === "") {
          const { books: newBooks, totalPages } = await BookService.get(state.currentPage);
          books = newBooks;
          dispatch({ type: "SET_TOTAL_PAGES", payload: totalPages });
        } else {
          books = await BookService.search(state.searchTerm);
        }
        if (books) dispatch({ type: "SET_BOOKS", payload: books });
      } catch (error) {
        console.error("Error fetching books", error);
      }
    };
    fetchBooks();
  }, [state.currentPage, state.searchTerm]);

  return {
    state: {
      books: state.books,
      totalPages: state.totalPages,
      currentPage: state.currentPage,
      inputSearchTerm,
      bookFormModal: state.bookFormModal,
      removeConfirmation: state.removeConfirmation,
    },
    setters: {
      setInputSearchTerm,
      setCurrentPage,
      setBookFormModal,
      setRemoveConfirmation,
    },
    handlers: {
      onInputKeyUp,
      applyBookChange,
      removeBook,
    }
  };
};