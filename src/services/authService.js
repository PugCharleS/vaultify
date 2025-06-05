import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma.js';
import UserRepository from '../repositories/userRepository.js';

class AuthService {
    constructor(userRepository = new UserRepository(prisma)) {
        this.userRepository = userRepository;
    }

    async registerUser(email, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.userRepository.createUser(email, hashedPassword);
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.AUTH_KEY, { expiresIn: '1h' });
        return { token, user };
    }

    async loginUser(email, password) {
        const user = await this.userRepository.findUserByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.AUTH_KEY, { expiresIn: '1h' });
        return { token, user };
    }
}

export { AuthService };
export default new AuthService();
