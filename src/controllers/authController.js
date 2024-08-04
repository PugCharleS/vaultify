import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import knex from '../db/knex.js';


export const registerUser = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await knex('users').insert({
            email,
            password: hashedPassword,
            plan: 'basic'
        }).returning(['id', 'email', 'created_at', 'plan']);

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error registering user', error });
    }
};


export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

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
        res.status(500).json({ message: 'Error logging in', error });
    }
};
