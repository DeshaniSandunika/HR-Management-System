const authService = require('../services/auth.service');

exports.register = (req, res) => {
    authService.registerUser(req.body, (err, result) => {
        if (err) return res.status(400).json(err);
        res.status(201).json({ message: 'User registered', user: result });
    });
};

exports.login = (req, res) => {
    authService.loginUser(req.body, (err, result) => {
        if (err) return res.status(401).json(err);
        res.json({
            token: result.token,
            role: result.user.role,
            user: result.user
        });
    });
};
