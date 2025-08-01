require('dotenv').config();
const express = require('express');
const cors = require('cors');
const livroRoutes = require('./routes/livroRoutes');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use('/api/livros', livroRoutes);
app.use('/api/auth', authRoutes);

sequelize.authenticate()
  .then(() => {
    console.log('🟢 Conectado ao MySQL');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Falha ao conectar ao banco:', err);
  });
