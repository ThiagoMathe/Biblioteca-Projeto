import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BookOpen, Plus, Calendar, User, FileText, Trash, Pencil } from 'lucide-react';

function App() {
  const [livros, setLivros] = useState([]);
  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    ano: '',
    descricao: '',
    disponivel: true
  });

  const [editandoId, setEditandoId] = useState(null);
  const [editForm, setEditForm] = useState({
    titulo: '',
    autor: '',
    ano: '',
    descricao: '',
    disponivel: true
  });

  useEffect(() => {
    fetchLivros();
  }, []);

  const fetchLivros = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/livros');
      setLivros(res.data);
    } catch (err) {
      console.error('Erro ao buscar livros:', err);
    }
  };

  const handleAdd = async () => {
    try {
      const res = await axios.post('http://localhost:3001/api/livros', formData);
      setLivros([...livros, res.data]);
      setFormData({ titulo: '', autor: '', ano: '', descricao: '', disponivel: true });
    } catch (err) {
      console.error('Erro ao adicionar livro:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja excluir este livro?')) return;
    try {
      await axios.delete(`http://localhost:3001/api/livros/${id}`);
      setLivros(livros.filter((livro) => livro.id !== id));
    } catch (err) {
      console.error('Erro ao excluir livro:', err);
    }
  };

  const handleEdit = (livro) => {
    setEditandoId(livro.id);
    setEditForm({ ...livro });
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(`http://localhost:3001/api/livros/${editandoId}`, editForm);
      setLivros(livros.map((livro) => (livro.id === editandoId ? res.data : livro)));
      setEditandoId(null);
    } catch (err) {
      console.error('Erro ao editar livro:', err);
    }
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center">
          <BookOpen className="w-8 h-8 mr-2 text-blue-600" /> Biblioteca Digital
        </h1>

        {/* Formulário de Adição */}
        <div className="bg-white p-6 rounded-xl shadow mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center text-blue-700">
            <Plus className="w-6 h-6 mr-2" /> Cadastrar Livro
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="input" placeholder="Título" value={formData.titulo} onChange={(e) => setFormData({ ...formData, titulo: e.target.value })} />
            <input className="input" placeholder="Autor" value={formData.autor} onChange={(e) => setFormData({ ...formData, autor: e.target.value })} />
            <input className="input" placeholder="Ano" type="number" value={formData.ano} onChange={(e) => setFormData({ ...formData, ano: e.target.value })} />
            <textarea className="input" placeholder="Descrição" rows={2} value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} />
            <label className="flex items-center mt-2 col-span-1 md:col-span-2">
              <input type="checkbox" checked={formData.disponivel} onChange={(e) => setFormData({ ...formData, disponivel: e.target.checked })} className="mr-2" />
              Disponível
            </label>
          </div>

          <button onClick={handleAdd} className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">Adicionar</button>
        </div>

        {/* Lista de Livros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {livros.map((livro) => (
            <div key={livro.id} className="bg-white p-5 rounded-xl shadow space-y-2">
              {editandoId === livro.id ? (
                <>
                  <input className="input" value={editForm.titulo} onChange={(e) => setEditForm({ ...editForm, titulo: e.target.value })} />
                  <input className="input" value={editForm.autor} onChange={(e) => setEditForm({ ...editForm, autor: e.target.value })} />
                  <input className="input" value={editForm.ano} onChange={(e) => setEditForm({ ...editForm, ano: e.target.value })} />
                  <textarea className="input" value={editForm.descricao} onChange={(e) => setEditForm({ ...editForm, descricao: e.target.value })} />
                  <label className="flex items-center">
                    <input type="checkbox" checked={editForm.disponivel} onChange={(e) => setEditForm({ ...editForm, disponivel: e.target.checked })} className="mr-2" />
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
