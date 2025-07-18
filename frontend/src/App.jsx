import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [livros, setLivros] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');

  const [editandoId, setEditandoId] = useState(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editAutor, setEditAutor] = useState('');
  const [editStatus, setEditStatus] = useState('');


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

  const addLivro = async () => {
    try {
      const res = await axios.post('http://localhost:3001/api/livros', {
        titulo,
        autor
      });
      setLivros([...livros, res.data]);
      setTitulo('');
      setAutor('');
    } catch (err) {
      console.error('Erro ao adicionar livro:', err);
    }
  };

  const deleteLivro = async (id) => {
    const confirm = window.confirm('Tem certeza que deseja excluir este livro?');
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:3001/api/livros/${id}`);
      setLivros(livros.filter((livro) => livro.id !== id));
    } catch (err) {
      console.error('Erro ao excluir livro:', err);
    }
};
  const iniciarEdicao = (livro) => {
    setEditandoId(livro.id);
    setEditTitulo(livro.titulo);
    setEditAutor(livro.autor);
    setEditStatus(livro.status || 'disponível'); // assume status padrão
};

  const salvarEdicao = async () => {
    try {
      const res = await axios.put(`http://localhost:3001/api/livros/${editandoId}`, {
        titulo: editTitulo,
        autor: editAutor,
        status: editStatus
      });

      setLivros(livros.map((livro) => 
        livro.id === editandoId ? res.data : livro
      ));
      
      setEditandoId(null);
      setEditTitulo('');
      setEditAutor('');
      setEditStatus('');
    } catch (err) {
      console.error('Erro ao editar livro:', err);
    }
  };




  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>Lista de Livros</h1>
      <ul>
        {livros.map((livro) => (
          <li key={livro.id} style={{ marginBottom: 10 }}>
            {editandoId === livro.id ? (
              <div>
                <input
                  value={editTitulo}
                  onChange={(e) => setEditTitulo(e.target.value)}
                  placeholder="Título"
                />
                <input
                  value={editAutor}
                  onChange={(e) => setEditAutor(e.target.value)}
                  placeholder="Autor"
                  style={{ marginLeft: 5 }}
                />
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  style={{ marginLeft: 5 }}
                >
                  <option value="disponível">Disponível</option>
                  <option value="emprestado">Emprestado</option>
                </select>
                <button onClick={salvarEdicao} style={{ marginLeft: 5 }}>Salvar</button>
                <button onClick={() => setEditandoId(null)} style={{ marginLeft: 5 }}>Cancelar</button>
              </div>
            ) : (
              <div>
                <b>{livro.titulo}</b> - {livro.autor} ({livro.status || 'disponível'})
                <button 
                  onClick={() => iniciarEdicao(livro)}
                  style={{ marginLeft: 10, cursor: 'pointer' }}
                >
                  Editar
                </button>
                <button 
                  onClick={() => deleteLivro(livro.id)}
                  style={{ marginLeft: 10, color: 'red', cursor: 'pointer' }}
                >
                  Excluir
                </button>
              </div>
              )}
            </li>
        ))}
    </ul>   


      <h2>Adicionar Livro</h2>
      <input
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />
      <br />
      <input
        placeholder="Autor"
        value={autor}
        onChange={(e) => setAutor(e.target.value)}
      />
      <br />
      <button onClick={addLivro}>Adicionar</button>

      
    </div>
  );
}

export default App;
