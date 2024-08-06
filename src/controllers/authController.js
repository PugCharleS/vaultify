import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import knex from '../db/knex.js';
import { body, validationResult } from 'express-validator';

export const registerUser = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 5 }).trim().escape(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const [user] = await knex('users').insert({
                email,
                password: hashedPassword,
                plan: 'basic'
            }).returning(['id', 'email', 'created_at', 'plan']);

            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.status(201).json({ token, user: { email: user.email, id: user.id, plan: user.plan } });
        } catch (error) {
            next(error);
        }
    }
];

export const loginUser = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 5 }).trim().escape(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const user = await knex('users').where({ email }).first();

            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.json({ token, email: user.email, id: user.id });
        } catch (error) {
            next(error);
        }
    }
];
