export interface Livro {
  id: number;
  titulo: string;
  autor: string;
  ano: string;
  descricao: string;
  disponivel: boolean;
}

export type LivroForm = Omit<Livro, 'id'>;