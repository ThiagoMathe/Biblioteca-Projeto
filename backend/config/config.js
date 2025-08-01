require('dotenv').config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'chave_secreta_padrao_para_dev',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h'
};