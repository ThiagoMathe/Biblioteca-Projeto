import { LivroForm } from "../App";
import { api } from "../libs/axios";

export class LivroService {
  static async fetch() {
    try {
      const res = await api.get('/api/livros');
      return res.data;
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Erro ao buscar livros: ${err.message}`);
      }
      throw new Error('Erro desconhecido ao buscar livros');
    }
  }

  static async add(formData: LivroForm) {
    try {
      const res = await api.post('/api/livros', formData);
      return res.data;
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Erro ao adicionar livro: ${err.message}`);
      }
      throw new Error('Erro desconhecido ao adicionar livro');
    }
  }

  static async update(id: number, editForm: LivroForm) {
    try {
      const res = await api.put(`/api/livros/${id}`, editForm);
      return res.data;
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Erro ao atualizar livro: ${err.message}`);
      }
      throw new Error('Erro desconhecido ao atualizar livro');
    }
  }

  static async delete(id: number) {
    try {
      const res = await api.delete(`/api/livros/${id}`);
      return res.data;
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Erro ao excluir livro: ${err.message}`);
      }
      throw new Error('Erro desconhecido ao excluir livro');
    }
  }
}