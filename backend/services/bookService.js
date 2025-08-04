const Book = require('../models/book');
const sequelize = require('../config/database');

exports.get = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    const { rows: books, count: totalItems } = await Book.findAndCountAll({
      limit,
      offset,
      order: [['id', 'DESC']],
    });

    res.json({
      books,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (err) {
    console.error('Erro ao buscar livros com paginação:', err);
    res.status(500).json({ error: 'Erro ao buscar livros' });
  }
};

exports.search = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === '') {
      return res.json([]);
    }

    const searchTerm = `%${query}%`;
    /* mudar: usar op */
    const books = await Book.findAll({
      where: sequelize.literal(
        `title LIKE '${searchTerm}' OR author LIKE '${searchTerm}' OR genre LIKE '${searchTerm}'`
      )
    });

    res.json(books);
  } catch (err) {
    console.error(err);
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

    const teste = await book.update(req.body);

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
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar livro' });
  }
};
