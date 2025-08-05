const { Op } = require("sequelize");
const User = require("../models/user");
const Book = require("../models/book");
const BorrowHistory = require("../models/borrowHistory");

exports.getDashboardData = async (req, res) => {
  try {
    const totalUsers = await User.count();

    const totalBooks = await Book.count();

    const totalReturned = await BorrowHistory.count({
      where: { status: 'Returned' },
    });

    const recentBorrowHistory = await BorrowHistory.findAll({
      limit: 10,
      order: [['borrowedAt', 'DESC']],
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
    });

    const history = recentBorrowHistory.map(item => ({
      id: item.id,
      userName: item.User?.name || '',
      bookTitle: item.Book?.title || '',
      borrowedAt: item.borrowedAt,
      returnedAt: item.returnedAt,
      status: item.status,
    }));

    res.json({
      totalUsers,
      totalBooks,
      totalReturned,
      recentBorrowHistory: history,
    });
  } catch (err) {
    console.error("Erro ao buscar dados do dashboard:", err);
    res.status(500).json({ error: "Erro ao buscar dados do dashboard" });
  }
};