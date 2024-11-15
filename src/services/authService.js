import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/userRepository.js';

class AuthService {
    async registerUser(email, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userRepository.createUser(email, hashedPassword);
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return { token, user };
    }

    async loginUser(email, password) {
        const user = await userRepository.findUserByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return { token, user };
    }
}

export default new AuthService();
