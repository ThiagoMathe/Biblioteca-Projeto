import React, { useEffect, useState, ChangeEvent } from 'react';
import { BookOpen, Plus, Calendar, User, Trash, Pencil } from 'lucide-react';
import { LivroService } from './services/livros.service';

export interface Livro {
  id: number;
  titulo: string;
  autor: string;
  ano: string;
  descricao: string;
  disponivel: boolean;
}

export type LivroForm = Omit<Livro, 'id'>;

function App() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [formData, setFormData] = useState<LivroForm>({
    titulo: '',
    autor: '',
    ano: '',
    descricao: '',
    disponivel: true,
  });

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<LivroForm>({
    titulo: '',
    autor: '',
    ano: '',
    descricao: '',
    disponivel: true,
  });

  useEffect(() => {
    fetchLivros();
  }, []);

  const fetchLivros = async () => {
    try {
      const res = await LivroService.fetch();
      setLivros(res.data);
    } catch (err) {
      console.error('Erro ao buscar livros:', err);
    }
  };

  const handleAdd = async () => {
    try {
      const res = await LivroService.add(formData);
      setLivros([...livros, res.data]);
      setFormData({
        titulo: '',
        autor: '',
        ano: '',
        descricao: '',
        disponivel: true,
      });
    } catch (err) {
      console.error('Erro ao adicionar livro:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Deseja excluir este livro?')) return;
    try {
      await LivroService.delete(id);
      setLivros(livros.filter((livro) => livro.id !== id));
    } catch (err) {
      console.error('Erro ao excluir livro:', err);
    }
  };

  const handleEdit = (livro: Livro) => {
    setEditandoId(livro.id);
    const { id, ...editData } = livro;
    setEditForm(editData);
  };

  const handleSave = async () => {
    if (editandoId === null) return;
    try {
      const res = await LivroService.update(editandoId, editForm);

      setLivros(livros.map((livro) => (livro.id === editandoId ? res.data : livro)));
      setEditandoId(null);
    } catch (err) {
      console.error('Erro ao editar livro:', err);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    formSetter: React.Dispatch<React.SetStateAction<LivroForm>>
  ) => {
    const { name, value, type, ...event } = e.target;
    formSetter((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (event as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center">
          <BookOpen className="w-8 h-8 mr-2 text-blue-600" /> Biblioteca Digital
        </h1>

        <div className="bg-white p-6 rounded-xl shadow mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center text-blue-700">
            <Plus className="w-6 h-6 mr-2" /> Cadastrar Livro
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="input" name="titulo" placeholder="Título" value={formData.titulo} onChange={(e) => handleInputChange(e, setFormData)} />
            <input className="input" name="autor" placeholder="Autor" value={formData.autor} onChange={(e) => handleInputChange(e, setFormData)} />
            <input className="input" name="ano" placeholder="Ano" type="number" value={formData.ano} onChange={(e) => handleInputChange(e, setFormData)} />
            <textarea className="input" name="descricao" placeholder="Descrição" rows={2} value={formData.descricao} onChange={(e) => handleInputChange(e, setFormData)} />
            <label className="flex items-center mt-2 col-span-1 md:col-span-2">
              <input type="checkbox" name="disponivel" checked={formData.disponivel} onChange={(e) => handleInputChange(e, setFormData)} className="mr-2" />
              Disponível
            </label>
          </div>

          <button onClick={handleAdd} className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
            Adicionar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {livros.map((livro) => (
            <div key={livro.id} className="bg-white p-5 rounded-xl shadow space-y-2">
              {editandoId === livro.id ? (
                <>
                  <input className="input" name="titulo" value={editForm.titulo} onChange={(e) => handleInputChange(e, setEditForm)} />
                  <input className="input" name="autor" value={editForm.autor} onChange={(e) => handleInputChange(e, setEditForm)} />
                  <input className="input" name="ano" value={editForm.ano} onChange={(e) => handleInputChange(e, setEditForm)} />
                  <textarea className="input" name="descricao" value={editForm.descricao} onChange={(e) => handleInputChange(e, setEditForm)} />
                  <label className="flex items-center">
                    <input type="checkbox" name="disponivel" checked={editForm.disponivel} onChange={(e) => handleInputChange(e, setEditForm)} className="mr-2" />
                    Disponível
                  </label>
                  <div className="flex gap-2">
                    <button onClick={handleSave} className="bg-green-600 text-white px-3 py-1 rounded">Salvar</button>
                    <button onClick={() => setEditandoId(null)} className="bg-gray-300 px-3 py-1 rounded">Cancelar</button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-bold">{livro.titulo}</h3>
                  <p className="text-sm text-gray-600"><User className="inline w-4 h-4 mr-1" /> {livro.autor}</p>
                  <p className="text-sm text-gray-600"><Calendar className="inline w-4 h-4 mr-1" /> {livro.ano}</p>
                  <p className="text-sm">{livro.descricao}</p>
                  <p className="text-sm text-blue-700 font-medium">Status: {livro.disponivel ? 'Disponível' : 'Emprestado'}</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => handleEdit(livro)} className="text-blue-600 hover:underline flex items-center"><Pencil className="w-4 h-4 mr-1" /> Editar</button>
                    <button onClick={() => handleDelete(livro.id)} className="text-red-600 hover:underline flex items-center"><Trash className="w-4 h-4 mr-1" /> Excluir</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;