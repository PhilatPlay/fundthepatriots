const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { check, validationResult } = require('express-validator');

dotenv.config();

exports.register = async (req, res) => {

    const { username, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            username,
            email,
            password,
        });

        await user.save();

        const payload = {
            user: {
                id: user.id,
            },
        };

        currentUser = payload.user;
        res.locals.user = currentUser;
        user = currentUser

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.json({
                status: 'success:',
                token,
                user: user,

            });
        });
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.login = [

    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ msg: 'No user exist with those details' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Creditials are not a match' });
            }

            const payload = {
                user: {
                    id: user.id,
                    role: user.role,
                },
            };

            jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
                if (err) throw err;
                res.json({
                    status: 'success:',
                    token,
                    user
                });
            });

        } catch (err) {
            res.status(500).send('Server error');
        }
    }
];

exports.logout = (req, res) => {
    // Optionally, you can implement token blacklisting here
    res.json({ status: 'success', message: 'Logged out successfully' });
};



