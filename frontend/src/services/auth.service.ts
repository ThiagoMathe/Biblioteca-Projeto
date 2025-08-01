import { api } from "../libs/axios";

// Tipos para melhor autocompletar
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
      // Ajuste para os campos que o backend espera
      const payload = {
        email: credentials.email,
        senha: credentials.password // Conversão para o nome que o backend espera
      };
      
      const res = await api.post("/auth/login", payload);
      
      // Armazena o token (opcional)
      localStorage.setItem('authToken', res.data.token);
      
      return {
        token: res.data.token,
        user: {
          id: res.data.usuario.id,
          name: res.data.usuario.nome,
          email: res.data.usuario.email
        }
      };
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Erro ao fazer login");
    }
  }

  static async register(data: RegisterParams): Promise<AuthResponse> {
    try {
      // Ajuste para os campos que o backend espera
      const payload = {
        nome: data.name,    // Conversão para "nome"
        email: data.email,
        senha: data.password // Conversão para "senha"
      };
      
      const res = await api.post("/auth/registrar", payload); // Rota corrigida
      
      return {
        token: res.data.token,
        user: {
          id: res.data.usuario.id,
          name: res.data.usuario.nome,
          email: res.data.usuario.email
        }
      };
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Erro ao registrar");
    }
  }
}