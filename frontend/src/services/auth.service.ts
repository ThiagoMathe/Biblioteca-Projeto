import Cookies from "js-cookie";
import { api } from "../libs/axios";

type LoginParams = {
  email: string;
  password: string;
};

type RegisterParams = {
  name: string;
  email: string;
  password: string;
};

type AuthResponse = {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

export class AuthService {
  static async login(credentials: LoginParams): Promise<AuthResponse> {
    try {
      const payload = {
        email: credentials.email,
        password: credentials.password // Conversão para o nome que o backend espera
      };

      const res = await api.post("/auth/login", payload);
      // Armazena o token
      Cookies.set("authToken", res.data.token)

      return {
        token: res.data.token,
        user: {
          id: res.data.user.id,
          name: res.data.user.name,
          email: res.data.user.email
        }
      };
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Login failed");
    }
  }

  static async register(data: RegisterParams): Promise<AuthResponse> {
    try {
      const payload = {
        name: data.name,    // Conversão para "nome"
        email: data.email,
        password: data.password // Conversão para "senha"
      };

      const res = await api.post("/auth/register", payload);

      Cookies.set("authToken", res.data.token)


      return {
        token: res.data.token,
        user: {
          id: res.data.user.id,
          name: res.data.user.name,
          email: res.data.user.email
        }
      };
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Register failed");
    }
  }
}