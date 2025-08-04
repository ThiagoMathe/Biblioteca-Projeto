const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Book = sequelize.define('Book', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  format: {
    type: DataTypes.ENUM("Physic", "Digital", "Hybrid"),
    allowNull: false
  },
  pubDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  availability: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  imageBase64: {
    type: DataTypes.STRING,
    allowNull: true
  },
}, {
  tableName: 'book'
});

module.exports = Book;