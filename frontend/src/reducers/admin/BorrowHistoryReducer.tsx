import { Borrow } from "../../models/borrow";

type BorrowHistoryStateType = {
  borrows: Borrow[];
  totalPages: number;
  currentPage: number;
  searchTerm: string;
}

type BorrowAction =
  | { type: "SET_BORROWS"; payload: Borrow[] }
  | { type: "SET_TOTAL_PAGES"; payload: number }
  | { type: "SET_CURRENT_PAGE"; payload: number }
  | { type: "SET_SEARCH_TERM"; payload: string }

export const initialBorrowHistoryState: BorrowHistoryStateType = {
  borrows: [],
  totalPages: 1,
  currentPage: 1,
  searchTerm: "",
}

export function BorrowHistoryReducer(state: BorrowHistoryStateType, action: BorrowAction): BorrowHistoryStateType {
  switch (action.type) {
    case "SET_BORROWS":
      return { ...state, borrows: action.payload }
    case "SET_TOTAL_PAGES":
      return { ...state, totalPages: action.payload }
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload }
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload }
    default:
      return state
  }
}
