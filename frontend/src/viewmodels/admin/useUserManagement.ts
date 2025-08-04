import { useEffect, useReducer, useState } from "react";
import { UserManagementReducer, initialUserManagementState } from "../../reducers/admin/UserManagementReducer";
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";

export const useUserManagement = () => {
    const [state, dispatch] = useReducer(UserManagementReducer, initialUserManagementState);
    const [inputSearchTerm, setInputSearchTerm] = useState("");

    // SETTERS
    const setCurrentPage = (page: number) => {
        dispatch({ type: "SET_CURRENT_PAGE", payload: page });
    };

    const setViewModal = (visible: boolean) => {
        dispatch({ type: "SET_VIEW_MODAL", payload: visible });
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

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                let users: User[];
                if (state.searchTerm.trim() === "") {
                    const { users: newUsers, totalPages } = await UserService.get(state.currentPage);
                    users = newUsers;
                    dispatch({ type: "SET_TOTAL_PAGES", payload: totalPages });
                } else {
                    users = await UserService.search(state.searchTerm);
                }
                if (users) dispatch({ type: "SET_USERS", payload: users });
            } catch (error) {
                console.error("Error fetching books", error);
            }
        };
        fetchUsers();
    }, [state.currentPage, state.searchTerm]);

    return {
        state: {
            users: state.users,
            totalPages: state.totalPages,
            currentPage: state.currentPage,
            inputSearchTerm,
            viewModal: state.viewModal,
        },
        setters: {
            setInputSearchTerm,
            setCurrentPage,
            setViewModal,
        },
        handlers: {
            onInputKeyUp,
        }
    };
}