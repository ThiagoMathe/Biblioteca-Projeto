require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const authRoutes = require('./routes/authRoutes');
const sequelize = require('./config/database');
const app = express();
const PORT = 3001;

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
