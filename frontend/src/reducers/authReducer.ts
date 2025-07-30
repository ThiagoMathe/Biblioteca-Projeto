export type FormState<T> = {
    form: T;
    errors: { [K in keyof T]: string };
};

export type FormAction<T> =
    | { type: "SET_FIELD"; field: keyof T; value: string }
    | { type: "SET_ERROR"; field: keyof T; error: string }
    | { type: "CLEAR_ERRORS" }
    | { type: "RESET_FORM" };

export function createAuthFormReducer<T extends object>(initialValues: T) {
    const initialState: FormState<T> = {
        form: initialValues,
        errors: Object.keys(initialValues).reduce((acc, key) => {
            acc[key as keyof T] = "";
            return acc;
        }, {} as { [K in keyof T]: string }),
    };

    function reducer(state: FormState<T>, action: FormAction<T>): FormState<T> {
        switch (action.type) {
            case "SET_FIELD":
                return {
                    ...state,
                    form: { ...state.form, [action.field]: action.value },
                };
            case "SET_ERROR":
                return {
                    ...state,
                    errors: { ...state.errors, [action.field]: action.error },
                };
            case "CLEAR_ERRORS":
                return {
                    ...state,
                    errors: initialState.errors,
                };
            case "RESET_FORM":
                return initialState;
            default:
                return state;
        }
    }
    
    return { reducer, initialState };
}