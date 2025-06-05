import prisma from '../db/prisma.js';

class UserRepository {
    async createUser(email, hashedPassword) {
        return await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
            },
        });
    }

    async findUserByEmail(email) {
        return await prisma.user.findUnique({
            where: { email },
        });
    }
}

export default new UserRepository();
