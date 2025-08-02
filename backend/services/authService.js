const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/config');

exports.register = async (req, res) => {
  try {
    const user = await User.create(req.body);

    // Debug: Verifique o usuário criado (sem a senha)
    console.log('Usuário criado:', {
      id: user.id,
      name: user.name,
      email: user.email
    });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN || '1h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Erro no registro:', err);

    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'Email já está em uso' });
    } else {
      res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Debug: Verifique os dados de login recebidos
    console.log('Tentativa de login:', { email });

    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log('Usuário não encontrado');
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Debug: Verifique a comparação de senhas
    console.log('Comparando senha para:', email);
    const validPassword = user.verifyPassword(password);
    console.log('Resultado da comparação:', validPassword);

    if (!validPassword) {
      console.log('Senha inválida');
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN || '1h' }
    );

    // Debug: Verifique o token gerado
    console.log('Token gerado para:', email);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};