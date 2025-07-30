import { RegisterForm } from "../../models/auth";
import { AuthService } from "../../services/auth.service";
import { useAuthForm } from "./useAuthForm";

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
  const onSubmit = (form: RegisterForm) => {
    console.log("Registering", form);
    AuthService.register(form);
  };

  return useAuthForm<RegisterForm>(initialRegisterForm, validateRegister, onSubmit);
}