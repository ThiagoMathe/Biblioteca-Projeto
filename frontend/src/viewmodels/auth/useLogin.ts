import { LoginForm } from "../../models/auth";
import { AuthService } from "../../services/auth.service";
import { useAuthForm } from "./useAuthForm";

const initialLoginForm: LoginForm = {
    email: "",
    password: "",
};

function validateLogin(form: LoginForm, dispatch: React.Dispatch<any>) {
    let valid = true;

    if (!/\S+@\S+\.\S+/.test(form.email)) {
        dispatch({ type: "SET_ERROR", field: "email", error: "Please enter a valid email address" });
        valid = false;
    }

    if (form.password.length < 8) {
        dispatch({ type: "SET_ERROR", field: "password", error: "Password must be at least 8 characters" });
        valid = false;
    }

    return valid;
}

export function useLogin() {
    const onSubmit = (form: LoginForm) => {
        console.log("Logging in with", form);
        AuthService.login(form);
    };

    return useAuthForm<LoginForm>(initialLoginForm, validateLogin, onSubmit);
}
