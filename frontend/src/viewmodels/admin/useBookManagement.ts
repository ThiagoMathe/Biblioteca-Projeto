import { useEffect, useReducer, useState } from "react";
import { BookManagementReducer, initialBookManagementState } from "../../reducers/admin/BookManagementReducer";
import { Book } from "../../models/book";
import { api } from "../../libs/axios";

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

  const setRemoveModal = (visible: false | true, id: number | null = null) => {
    dispatch({ type: "SET_REMOVE_MODAL", payload: { visible, id } })
  }

  /* mudar aqui */
  const handleRemove = (id: number) => {
    console.log("remove:", id)
  }

  /*   useEffect(() => {
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
    }, [state.sortConfig]) */

  /* mudar (usar do service) */
  /*     useEffect(() => {
        const fetchBooks = async () => {
          try {
            let res;
            if (state.searchTerm.trim() === "") {
              res = await api.get("/api/livros", {
                params: { page: state.currentPage }
              });
            } else {
              res = await api.get("/api/books/search", {
                params: { query: state.searchTerm }
              });
            }
            dispatch({ type: "SET_BOOKS", payload: res.data.books });
          } catch (error) {
            console.error("Error fetching books", error);
          }
        };
    
        fetchBooks();
      }, [state.currentPage, state.searchTerm]); */

  return {
    books: state.books,
    totalPages: state.totalPages,
    sortConfig: state.sortConfig,
    currentPage: state.currentPage,
    inputSearchTerm,
    bookFormModal: state.bookFormModal,
    removeModal: state.removeModal,
    setInputSearchTerm,
    setSortConfig,
    setCurrentPage,
    onInputKeyDown,
    setBookFormModal,
    setRemoveModal,
    handleRemove
  };
};