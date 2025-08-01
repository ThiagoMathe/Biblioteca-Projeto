const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/config');

exports.registrar = async (req, res) => {
  try {
    // Debug: Verifique os dados recebidos
    console.log('Dados de registro:', req.body);
    
    const usuario = await Usuario.create(req.body);
    
    // Debug: Verifique o usuário criado (sem a senha)
    console.log('Usuário criado:', {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email
    });

    res.status(201).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email
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
    const { email, senha } = req.body;
    
    // Debug: Verifique os dados de login recebidos
    console.log('Tentativa de login:', { email });

    const usuario = await Usuario.findOne({ where: { email } });
    
    if (!usuario) {
      console.log('Usuário não encontrado');
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Debug: Verifique a comparação de senhas
    console.log('Comparando senha para:', email);
    const senhaValida = usuario.verificarSenha(senha);
    console.log('Resultado da comparação:', senhaValida);

    if (!senhaValida) {
      console.log('Senha inválida');
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN || '1h' }
    );

    // Debug: Verifique o token gerado
    console.log('Token gerado para:', email);

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      }
    });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};