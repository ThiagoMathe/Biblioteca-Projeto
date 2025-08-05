const { Op } = require('sequelize');
const BorrowHistory = require('../models/borrowHistory');
const Book = require('../models/book');
const User = require('../models/user');

// pega todo o historico
exports.getAllBorrowHistoryPaginated = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    const { rows: history, count: totalItems } = await BorrowHistory.findAndCountAll({
      limit,
      offset,
      order: [['borrowedAt', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['name']
        },
        {
          model: Book,
          attributes: ['title']
        }
      ],
    });

    const result = history.map(item => ({
      id: item.id,
      userName: item.User.name,
      bookTitle: item.Book.title,
      borrowedAt: item.borrowedAt,
      returnedAt: item.returnedAt,
      status: item.status
    }));

    res.json({
      history: result,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page
    });
  } catch (err) {
    console.error('Erro ao buscar histórico com paginação:', err);
    res.status(500).json({ error: 'Erro ao buscar histórico' });
  }
};

exports.searchBorrowHistory = async (req, res) => {
  try {
    const { query = '' } = req.query;

    const searchTerm = `%${query}%`;

    const history = await BorrowHistory.findAll({
      where: {
        [Op.or]: [
          { status: { [Op.like]: searchTerm } },
          { '$User.name$': { [Op.like]: searchTerm } },
          { '$Book.title$': { [Op.like]: searchTerm } }
        ],
      },
      include: [
        {
          model: User,
          attributes: ['name'],
        },
        {
          model: Book,
          attributes: ['title'],
        },
      ],
      order: [['borrowedAt', 'DESC']],
    });

    const result = history.map(item => ({
      id: item.id,
      userName: item.User?.name || '',
      bookTitle: item.Book?.title || '',
      borrowedAt: item.borrowedAt,
      returnedAt: item.returnedAt,
      status: item.status,
    }));

    res.json(result);
  } catch (err) {
    console.error('Erro ao buscar histórico com filtro:', err);
    res.status(500).json({ error: 'Erro ao buscar histórico' });
  }
};

// Alugar um livro
exports.borrow = async (req, res) => {
  const { userId, bookId, dias } = req.body;

  try {
    const book = await Book.findByPk(bookId);
    if (!book) return res.status(404).json({ error: 'Livro não encontrado' });

    const isPhysical = book.format === 'Physic';

    if (isPhysical && book.availableCopies <= 0) {
      return res.status(400).json({ error: 'Livro físico indisponível' });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + dias);

    await BorrowHistory.create({
      userId,
      bookId,
      borrowedAt: new Date(),
      dueDate,
      status: 'Active'
    });

    if (isPhysical) {
      book.availableCopies -= 1;
      if (book.availableCopies === 0) book.availability = false;
      await book.save();
    }

    res.status(200).json({ message: 'Livro emprestado com sucesso!' });
  } catch (err) {
    console.error('Erro ao emprestar livro:', err);
    res.status(500).json({ error: 'Erro ao emprestar livro' });
  }
};

// Devolver um livro
exports.return = async (req, res) => {
  const { borrowId } = req.params;

  try {
    const history = await BorrowHistory.findByPk(borrowId);
    if (!history || history.status !== 'Active') {
      return res.status(400).json({ error: 'Empréstimo inválido ou já devolvido' });
    }

    const book = await Book.findByPk(history.bookId);

    history.returnedAt = new Date();
    history.status = 'Returned';
    await history.save();

    if (book.format === 'Physic') {
      book.availableCopies += 1;
      book.availability = true;
      await book.save();
    }

    res.json({ message: 'Livro devolvido com sucesso!' });
  } catch (err) {
    console.error('Erro ao devolver livro:', err);
    res.status(500).json({ error: 'Erro ao devolver livro' });
  }
};

// Histórico por usuário
exports.getByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const history = await BorrowHistory.findAll({
      where: { userId },
      include: [Book],
      order: [['borrowedAt', 'DESC']]
    });

    res.json(history);
  } catch (err) {
    console.error('Erro ao buscar histórico do usuário:', err);
    res.status(500).json({ error: 'Erro ao buscar histórico' });
  }
};

// Empréstimos ativos
exports.getActive = async (req, res) => {
  try {
    const active = await BorrowHistory.findAll({
      where: { status: 'Active' },
      include: [Book, User]
    });

    res.json(active);
  } catch (err) {
    console.error('Erro ao buscar empréstimos ativos:', err);
    res.status(500).json({ error: 'Erro ao buscar empréstimos ativos' });
  }
};

// Marcar atrasados automaticamente
exports.markLate = async (req, res) => {
  try {
    const now = new Date();

    const [affected] = await BorrowHistory.update(
      { status: 'Late' },
      {
        where: {
          status: 'Active',
          dueDate: { [Op.lt]: now }
        }
      }
    );

    res.json({ message: `${affected} empréstimos marcados como atrasados` });
  } catch (err) {
    console.error('Erro ao marcar empréstimos atrasados:', err);
    res.status(500).json({ error: 'Erro ao atualizar status de empréstimos' });
  }
};