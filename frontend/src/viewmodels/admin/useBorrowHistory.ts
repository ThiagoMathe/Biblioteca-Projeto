import { useEffect, useReducer, useState } from "react";
import { Borrow } from "../../models/borrow";
import { BorrowHistoryReducer, initialBorrowHistoryState } from "../../reducers/admin/BorrowHistoryReducer";
import { BorrowHistoryService } from "../../services/borrowHistory.service";

export const useBorrowHistory = () => {
  const [state, dispatch] = useReducer(BorrowHistoryReducer, initialBorrowHistoryState);
  const [inputSearchTerm, setInputSearchTerm] = useState("");

  // SETTERS
  const setCurrentPage = (page: number) => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: page });
  };

  // HANDLERS
  const onInputKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentValue = e.currentTarget.value;

    if (e.key === "Enter") {
      dispatch({ type: "SET_SEARCH_TERM", payload: inputSearchTerm.trim() });
    } else if (e.key === "Backspace" && currentValue.length === 0) {
      dispatch({ type: "SET_SEARCH_TERM", payload: "" });
    }
  };

  useEffect(() => {
    const fetchBorrows = async () => {
      try {
        let borrows: Borrow[];
        if (state.searchTerm.trim() === "") {
          const { history: newBorrows, totalPages } = await BorrowHistoryService.get(state.currentPage);
          borrows = newBorrows;
          dispatch({ type: "SET_TOTAL_PAGES", payload: totalPages });
        } else {
          borrows = await BorrowHistoryService.search(state.searchTerm);
          dispatch({ type: "SET_TOTAL_PAGES", payload: 1 });
          dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
        }
        if (borrows) dispatch({ type: "SET_BORROWS", payload: borrows });
      } catch (error) {
        console.error("Error fetching borrow history", error);
      }
    };

    fetchBorrows();
  }, [state.currentPage, state.searchTerm]);

  return {
    state: {
      borrows: state.borrows,
      totalPages: state.totalPages,
      currentPage: state.currentPage,
      inputSearchTerm,
    },
    setters: {
      setInputSearchTerm,
      setCurrentPage,
    },
    handlers: {
      onInputKeyUp,
    }
  };
};