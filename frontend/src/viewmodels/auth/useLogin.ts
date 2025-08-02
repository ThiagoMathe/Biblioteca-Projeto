import Swal from "sweetalert2";
import { LoginForm } from "../../models/auth";
import { AuthService } from "../../services/auth.service";
import { useAuthForm } from "./useAuthForm";
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();
    const onSubmit = async (form: LoginForm) => {
        try {
            await AuthService.login(form);

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'You have been logged in.',
                showConfirmButton: false,
                timer: 2000,
            }).then(() => {
                navigate('/dashboard');
            });

        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: err.message || 'Something went wrong. Please try again.',
                showConfirmButton: false,
                timer: 1000,
            });
        }
    };


    return useAuthForm<LoginForm>(initialLoginForm, validateLogin, onSubmit);
}
