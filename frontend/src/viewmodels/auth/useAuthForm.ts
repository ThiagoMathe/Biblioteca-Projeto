import { useReducer, useState } from "react";
import { createAuthFormReducer } from "../../reducers/authReducer";

type Validator<T> = (form: T, dispatch: React.Dispatch<any>) => boolean;

export function useAuthForm<T extends object>(
  initialValues: T,
  validate: Validator<T>,
  onSubmit: (form: T) => void
) {
  const { reducer, initialState } = createAuthFormReducer<T>(initialValues);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof T) => (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_FIELD", field, value: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    dispatch({ type: "CLEAR_ERRORS" });

    if (!validate(state.form, dispatch)) {
      setLoading(false);
      return;
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await onSubmit(state.form);
      dispatch({ type: "RESET_FORM" });
    } finally {
      setLoading(false);
    }
  };

  return {
    form: state.form,
    errors: state.errors,
    handleChange,
    handleSubmit,
    loading,
  };
}