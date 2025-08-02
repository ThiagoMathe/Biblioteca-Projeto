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
        senha: credentials.password
      };
      
      const res = await api.post("/api/auth/login", payload);
      
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
      const payload = {
        nome: data.name,   
        email: data.email,
        senha: data.password 
      };
      
      const res = await api.post("/api/auth/registrar", payload); 
      
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