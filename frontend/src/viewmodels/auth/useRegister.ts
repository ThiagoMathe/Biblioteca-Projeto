import { useNavigate } from "react-router-dom";
import { RegisterForm } from "../../models/auth";
import { AuthService } from "../../services/auth.service";
import { useAuthForm } from "./useAuthForm";
import Swal from "sweetalert2";

const initialRegisterForm: RegisterForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function validateRegister(form: RegisterForm, dispatch: React.Dispatch<any>) {
  let valid = true;

  if (!form.name.trim()) {
    dispatch({ type: "SET_ERROR", field: "name", error: "Name is required" });
    valid = false;
  }

  if (!/\S+@\S+\.\S+/.test(form.email)) {
    dispatch({ type: "SET_ERROR", field: "email", error: "Please enter a valid email address" });
    valid = false;
  }

  if (form.password.length < 8) {
    dispatch({ type: "SET_ERROR", field: "password", error: "Password must be at least 8 characters" });
    valid = false;
  }

  if (form.password !== form.confirmPassword) {
    dispatch({ type: "SET_ERROR", field: "confirmPassword", error: "Passwords do not match" });
    valid = false;
  }

  return valid;
}

export function useRegister() {
  const navigate = useNavigate();
  const onSubmit = async (form: RegisterForm) => {
    try {
      await AuthService.register(form);

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'You have been registered',
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        navigate('/dashboard');
      });

    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Register Failed',
        text: err.message || 'Something went wrong. Please try again.',
        showConfirmButton: false,
        timer: 1000,
      });
    }
  };

  return useAuthForm<RegisterForm>(initialRegisterForm, validateRegister, onSubmit);
}