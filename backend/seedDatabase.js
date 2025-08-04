const sequelize = require('./config/database');
const Book = require('./models/book');
const User = require('./models/user');
const BorrowHistory = require('./models/borrowHistory'); // "borrowHistory" e não "BorrowHistory" (case sensitive)

// Defina as associações aqui se não estiverem definidas no index.js
User.hasMany(BorrowHistory, { foreignKey: 'userId' });
BorrowHistory.belongsTo(User, { foreignKey: 'userId' });

Book.hasMany(BorrowHistory, { foreignKey: 'bookId' });
BorrowHistory.belongsTo(Book, { foreignKey: 'bookId' });

async function seed() {
  try {
    await sequelize.sync({ force: true }); // força recriação das tabelas
    
    // Crie usuários
    const usersData = [];
    for (let i = 1; i <= 30; i++) {
      usersData.push({
        name: `User ${i}`,
        email: `user${i}@example.com`,
        password: 'password123',
        status: 'Active',
        role: i === 1 ? 'Admin' : 'User'
      });
    }
    const users = await User.bulkCreate(usersData);

    // Crie livros
    const formats = ['Physic', 'Digital', 'Hybrid'];
    const booksData = [];
    for (let i = 1; i <= 30; i++) {
      const format = formats[Math.floor(Math.random() * formats.length)];
      booksData.push({
        title: `Book Title ${i}`,
        description: `Description of Book ${i}`,
        author: `Author ${i}`,
        genre: ['Fiction', 'Non-fiction', 'Sci-fi', 'Fantasy'][i % 4],
        format,
        pubDate: new Date(2020 + (i % 5), 0, 1),
        totalCopies: format === 'Physic' ? Math.floor(Math.random() * 5) + 1 : null,
        availableCopies: format === 'Physic' ? Math.floor(Math.random() * 5) + 1 : null,
        availability: true,
        imageBase64: null
      });
    }
    const books = await Book.bulkCreate(booksData);

    // Crie registros de BorrowHistory, usando IDs válidos que foram criados acima
    const borrowData = [];
    for (let i = 0; i < 30; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const book = books[Math.floor(Math.random() * books.length)];

      const borrowedAt = new Date();
      borrowedAt.setDate(borrowedAt.getDate() - Math.floor(Math.random() * 30));
      const dueDate = new Date(borrowedAt);
      dueDate.setDate(dueDate.getDate() + 14);

      const isReturned = Math.random() > 0.5;
      const returnedAt = isReturned ? new Date(borrowedAt.getTime() + (Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000)) : null;
      const status = isReturned ? 'Returned' : (dueDate < new Date() ? 'Late' : 'Active');

      borrowData.push({
        userId: user.id,
        bookId: book.id,
        borrowedAt,
        dueDate,
        returnedAt,
        status
      });
    }

    await BorrowHistory.bulkCreate(borrowData);

    console.log('Banco de dados populado com sucesso!');
    process.exit(0);
  } catch (err) {
    console.error('Erro ao popular banco:', err);
    process.exit(1);
  }
}

seed();