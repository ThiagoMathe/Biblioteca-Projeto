require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const authRoutes = require('./routes/authRoutes');
const borrowHistoryRoutes = require('./routes/borrowHistoryRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const User = require('./models/user.js');
const Book = require('./models/book.js');
const BorrowHistory = require('./models/borrowHistory.js');

require('./cronJobs');

User.hasMany(BorrowHistory, { foreignKey: 'userId' });
BorrowHistory.belongsTo(User, { foreignKey: 'userId' });

Book.hasMany(BorrowHistory, { foreignKey: 'bookId' });
BorrowHistory.belongsTo(Book, { foreignKey: 'bookId' });

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/borrow', borrowHistoryRoutes);
app.use('/api/dashboard', dashboardRoutes);

sequelize.authenticate()
  .then(() => {
    console.log('🟢 Conectado ao MySQL');
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Falha ao conectar ao banco:', err);
  });