const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('meuprojeto', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
  define: {
    timestamps: false // para não criar colunas createdAt e updatedAt automaticamente
  }
});

module.exports = sequelize;
