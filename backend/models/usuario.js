const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const Usuario = sequelize.define('Usuario', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      // Hash da senha antes de salvar
      const hash = bcrypt.hashSync(value, 10);
      this.setDataValue('senha', hash);
    }
  }
}, {
  tableName: 'usuarios'
});

// Método para verificar senha
Usuario.prototype.verificarSenha = function(senha) {
  return bcrypt.compareSync(senha, this.senha);
};

module.exports = Usuario;