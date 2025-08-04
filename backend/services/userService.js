const { Op } = require('sequelize');
const sequelize = require('../config/database');
const User = require('../models/user');

exports.get = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const offset = (page - 1) * limit;

        const { rows: users, count: totalItems } = await User.findAndCountAll({
            limit,
            offset,
            order: [['id', 'DESC']],
        });

        const usersFormatted = users.map(user => {
            const { id, name, email, status, joinedDate } = user;
            return {
                id,
                name,
                email,
                status,
                joinedDate: joinedDate ? joinedDate.toISOString().split('T')[0] : null,
            };
        });

        res.json({
            users: usersFormatted,
            totalPages: Math.ceil(totalItems / limit),
        });
    } catch (err) {
        console.error('Erro ao buscar usuarios com paginação:', err);
        res.status(500).json({ error: 'Erro ao buscar usuarios' });
    }
};


exports.search = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim() === '') {
            return res.json([]);
        }

        const searchTerm = `%${query}%`;

        const users = await User.findAll({
            attributes: ['name', 'email', 'status', 'joinedDate'],
            where: {
                [Op.or]: [
                    { name: { [Op.like]: searchTerm } },
                    { email: { [Op.like]: searchTerm } },
                    { status: { [Op.like]: searchTerm } },
                ]
            }
        });

        const usersFormatted = users.map(user => {
            const { name, email, status, joinedDate } = user;
            return {
                name,
                email,
                status,
                joinedDate: joinedDate ? joinedDate.toISOString().split('T')[0] : null,
            };
        });

        res.json(usersFormatted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar usuarios' });
    }
};