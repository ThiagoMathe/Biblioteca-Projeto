import { Book } from "../../models/book"

type BookManagementStateType = {
    books: Book[],
    totalPages: number,
    searchTerm: string,
    sortConfig: {
        key: keyof Book
        direction: "asc" | "desc"
    } | null,
    currentPage: number,
    bookFormModal: {
        type: "edit" | "add" | null,
        info: Book | null,
    }
    removeConfirmation: {
        visible: boolean,
        id: number | null
    }
}

type BookAction =
    | { type: "SET_BOOKS"; payload: Book[] }
    | { type: "SET_TOTAL_PAGES"; payload: number }
    | { type: "SET_SEARCH_TERM"; payload: string }
    | { type: "SET_SORT_CONFIG"; payload: { key: keyof Book; direction: "asc" | "desc" } }
    | { type: "SET_CURRENT_PAGE"; payload: number }
    | { type: "SET_BOOK_FORM_MODAL"; payload: { type: "edit" | "add" | null, info: Book | null } }
    | { type: "SET_REMOVE_CONFIRMATION"; payload: { visible: boolean, id: number | null } }

export const initialBookManagementState: BookManagementStateType = {
    books: [],
    totalPages: 1,
    searchTerm: "",
    sortConfig: { key: "title", direction: "asc" },
    currentPage: 1,
    bookFormModal: {
        type: null,
        info: null
    },
    removeConfirmation: {
        visible: false,
        id: null,
    }
}

export function BookManagementReducer(state: BookManagementStateType, action: BookAction) {
    switch (action.type) {
        case "SET_BOOKS":
            return { ...state, books: action.payload }
        case "SET_TOTAL_PAGES":
            return { ...state, totalPages: action.payload }
        case "SET_SEARCH_TERM":
            return { ...state, searchTerm: action.payload }
        case "SET_SORT_CONFIG":
            return { ...state, sortConfig: action.payload }
        case "SET_CURRENT_PAGE":
            return { ...state, currentPage: action.payload }
        case "SET_BOOK_FORM_MODAL":
            return { ...state, bookFormModal: action.payload }
        case "SET_REMOVE_CONFIRMATION":
            return { ...state, removeConfirmation: action.payload }
        default:
            return state
    }
}