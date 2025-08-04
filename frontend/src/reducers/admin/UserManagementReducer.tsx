import { User } from "../../models/user"

type UserManagementStateType = {
    users: User[],
    totalPages: number,
    currentPage: number,
    searchTerm: string,
    viewModal: boolean,
}

type UserAction =
    | { type: "SET_USERS"; payload: User[] }
    | { type: "SET_TOTAL_PAGES"; payload: number }
    | { type: "SET_CURRENT_PAGE"; payload: number }
    | { type: "SET_SEARCH_TERM"; payload: string }
    | { type: "SET_VIEW_MODAL"; payload: boolean }

export const initialUserManagementState: UserManagementStateType = {
    users: [],
    totalPages: 1,
    currentPage: 1,
    searchTerm: "",
    viewModal: false
}

export function UserManagementReducer(state: UserManagementStateType, action: UserAction) {
    switch (action.type) {
        case "SET_USERS":
            return { ...state, users: action.payload }
        case "SET_TOTAL_PAGES":
            return { ...state, totalPages: action.payload }
        case "SET_CURRENT_PAGE":
            return { ...state, currentPage: action.payload }
        case "SET_SEARCH_TERM":
            return { ...state, searchTerm: action.payload }
        case "SET_VIEW_MODAL":
            return { ...state, viewModal: action.payload }
        default:
            return state
    }
}