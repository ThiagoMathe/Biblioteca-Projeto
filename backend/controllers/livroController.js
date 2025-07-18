const Livro = require('../models/Livro');

exports.getLivros = async (req, res) => {
  try {
    const livros = await Livro.findAll();
    res.json(livros);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar livros' });
  }
};

exports.addLivro = async (req, res) => {
  try {
    const novo = await Livro.create(req.body);
    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar livro' });
  }
};

exports.updateLivro = async (req, res) => {
  try {
    const { id } = req.params;
    const livro = await Livro.findByPk(id);
    if (!livro) return res.status(404).json({ message: 'Livro não encontrado' });

    await livro.update(req.body);
    res.json(livro);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar livro' });
  }
};

exports.deleteLivro = async (req, res) => {
  try {
    const { id } = req.params;
    const livro = await Livro.findByPk(id);
    if (!livro) return res.status(404).json({ message: 'Livro não encontrado' });

    await livro.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar livro' });
  }
};
