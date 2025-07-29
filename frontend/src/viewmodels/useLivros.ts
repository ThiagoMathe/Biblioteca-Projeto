import { useEffect, useState } from "react";
import { Livro, LivroForm } from "../models/livro";
import { LivroService } from "../services/livros.service";

export function useLivros() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [formData, setFormData] = useState<LivroForm>({
    titulo: "",
    autor: "",
    ano: "",
    descricao: "",
    disponivel: true,
  });

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<LivroForm>({
    titulo: "",
    autor: "",
    ano: "",
    descricao: "",
    disponivel: true,
  });

  useEffect(() => {
    fetchLivros();
  }, []);

  const fetchLivros = async () => {
    try {
      const data = await LivroService.fetch();
      setLivros(data);
    } catch (err) {
      console.error(err);
    }
  };

  const addLivro = async () => {
    try {
      const data = await LivroService.add(formData);
      setLivros([...livros, data]);
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const updateLivro = async () => {
    if (editandoId === null) return;
    try {
      const data = await LivroService.update(editandoId, editForm);
      setLivros(livros.map((livro) => livro.id === editandoId ? data : livro));
      setEditandoId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteLivro = async (id: number) => {
    try {
      await LivroService.delete(id);
      setLivros(livros.filter((livro) => livro.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: "",
      autor: "",
      ano: "",
      descricao: "",
      disponivel: true,
    });
  };

  return {
    livros,
    formData,
    setFormData,
    editandoId,
    editForm,
    setEditForm,
    setEditandoId,
    addLivro,
    updateLivro,
    deleteLivro,
  };
}