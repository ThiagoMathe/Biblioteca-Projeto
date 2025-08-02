const Book = require('../models/book');

exports.get = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar livros' });
  }
};

exports.add = async (req, res) => {
  try {
    const newBook = await Book.create(req.body);
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar livro' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);
    if (!book) return res.status(404).json({ message: 'Livro não encontrado' });

    await book.update(req.body);
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar livro' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);
    if (!book) return res.status(404).json({ message: 'Livro não encontrado' });

    await book.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar livro' });
  }
};
