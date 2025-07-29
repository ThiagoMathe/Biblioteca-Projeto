import React from "react";
import { useLivros } from "../viewmodels/useLivros";
import { BookOpen, Plus, Calendar, User, Trash, Pencil } from "lucide-react";

const LivroApp = () => {
    const {
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
    } = useLivros();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editandoId !== null) {
            updateLivro();
        } else {
            addLivro();
        }
    };

    const startEdit = (id: number) => {
        const livro = livros.find((l) => l.id === id);
        if (!livro) return;
        setEditandoId(id);
        setEditForm({
            titulo: livro.titulo,
            autor: livro.autor,
            ano: livro.ano,
            descricao: livro.descricao,
            disponivel: livro.disponivel,
        });
    };

    const cancelEdit = () => {
        setEditandoId(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 mr-2 text-blue-600" /> Biblioteca Digital
                </h1>

                {(
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white p-6 rounded-xl shadow mb-10"
                    >
                        <h2 className="text-2xl font-semibold mb-4 flex items-center text-blue-700">
                            <Plus className="w-6 h-6 mr-2" />
                            Cadastrar Livro
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                className="border rounded px-3 py-2 w-full"
                                type="text"
                                placeholder="Título"
                                value={formData.titulo}
                                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                                required
                            />

                            <input
                                className="border rounded px-3 py-2 w-full"
                                type="text"
                                placeholder="Autor"
                                value={formData.autor}
                                onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
                                required
                            />

                            <input
                                className="border rounded px-3 py-2 w-full"
                                type="number"
                                placeholder="Ano"
                                value={formData.ano}
                                onChange={(e) => setFormData({ ...formData, ano: e.target.value })}
                                required
                            />

                            <textarea
                                className="border rounded px-3 py-2 w-full"
                                placeholder="Descrição"
                                rows={2}
                                value={formData.descricao}
                                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                            />

                            <label className="flex items-center mt-2 col-span-1 md:col-span-2">
                                <input
                                    type="checkbox"
                                    checked={formData.disponivel}
                                    onChange={(e) =>
                                        setFormData({ ...formData, disponivel: e.target.checked })
                                    }
                                    className="mr-2"
                                />
                                Disponível
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                        >
                            Adicionar Livro
                        </button>
                    </form>
                )}

                {/* Lista de livros */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {livros.map((livro) =>
                        editandoId === livro.id ? (
                            <div
                                key={livro.id}
                                className="bg-white p-5 rounded-xl shadow space-y-2"
                            >
                                <input
                                    className="border rounded px-3 py-2 w-full"
                                    type="text"
                                    value={editForm.titulo}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, titulo: e.target.value })
                                    }
                                    required
                                />
                                <input
                                    className="border rounded px-3 py-2 w-full"
                                    type="text"
                                    value={editForm.autor}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, autor: e.target.value })
                                    }
                                    required
                                />
                                <input
                                    className="border rounded px-3 py-2 w-full"
                                    type="number"
                                    value={editForm.ano}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, ano: e.target.value })
                                    }
                                    required
                                />
                                <textarea
                                    className="border rounded px-3 py-2 w-full"
                                    rows={2}
                                    value={editForm.descricao}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, descricao: e.target.value })
                                    }
                                />
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={editForm.disponivel}
                                        onChange={(e) =>
                                            setEditForm({ ...editForm, disponivel: e.target.checked })
                                        }
                                        className="mr-2"
                                    />
                                    Disponível
                                </label>
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={updateLivro}
                                        className="bg-green-600 text-white px-3 py-1 rounded"
                                    >
                                        Salvar
                                    </button>
                                    <button
                                        onClick={cancelEdit}
                                        className="bg-gray-300 px-3 py-1 rounded"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div
                                key={livro.id}
                                className="bg-white p-5 rounded-xl shadow space-y-2"
                            >
                                <h3 className="text-lg font-bold">{livro.titulo}</h3>
                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                    <User className="w-4 h-4" /> {livro.autor}
                                </p>
                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                    <Calendar className="w-4 h-4" /> {livro.ano}
                                </p>
                                <p className="text-sm">{livro.descricao}</p>
                                <p className="text-sm text-blue-700 font-medium">
                                    Status: {livro.disponivel ? "Disponível" : "Emprestado"}
                                </p>

                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={() => startEdit(livro.id)}
                                        className="text-blue-600 hover:underline flex items-center gap-1"
                                    >
                                        <Pencil className="w-4 h-4" /> Editar
                                    </button>
                                    <button
                                        onClick={() => deleteLivro(livro.id)}
                                        className="text-red-600 hover:underline flex items-center gap-1"
                                    >
                                        <Trash className="w-4 h-4" /> Excluir
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default LivroApp;