require('dotenv').config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'chave_secreta',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h'
};