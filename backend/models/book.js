const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Book = sequelize.define('Book', {
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  author: DataTypes.STRING,
  genre: DataTypes.STRING,
  format: {
    type: DataTypes.ENUM("Physic", "Digital", "Hybrid"),
    allowNull: false
  },
  pubDate: DataTypes.DATEONLY,
  totalCopies: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  availableCopies: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  imageBase64: DataTypes.STRING,
  availability: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'books'
});

module.exports = Book;