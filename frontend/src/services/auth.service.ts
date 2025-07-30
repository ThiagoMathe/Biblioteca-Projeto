import { api } from "../libs/axios";

/* mudar rotas */
export class AuthService {
  static async login(credentials: { email: string; password: string }) {
    try {
      const res = await api.post("/login", credentials);
      return res.data;
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Login error: ${err.message}`);
      }
      throw new Error("Unknown error occurred during login.");
    }
  }

  static async register(data: { name: string; email: string; password: string }) {
    try {
      const res = await api.post("/register", data);
      return res.data;
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Registration error: ${err.message}`);
      }
      throw new Error("Unknown error occurred during registration.");
    }
  }
}
