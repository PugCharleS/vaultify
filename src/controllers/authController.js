import { body, validationResult } from 'express-validator';
import authService from '../services/authService.js';

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
            const { token, user } = await authService.registerUser(email, password);
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
            const { token, user } = await authService.loginUser(email, password);
            res.json({ token, email: user.email, id: user.id });
        } catch (error) {
            next(error);
        }
    }
];
