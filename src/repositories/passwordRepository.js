import prisma from '../db/prisma.js';

class PasswordRepository {
    async getPasswords(vaultId, userId) {
        return await prisma.password.findMany({
            where: {
                vaultId,
                userId,
            },
            select: {
                id: true,
                name: true,
                username: true,
                type: true,
                createdAt: true,
            },
        });
    }

    async createPassword(vaultId, userId, name, password, username, type) {
        return await prisma.password.create({
            data: {
                vaultId,
                userId,
                name,
                password,
                username,
                type,
            },
            select: {
                id: true,
                name: true,
                username: true,
                type: true,
                createdAt: true,
            },
        });
    }

    async updatePassword(vaultId, passwordId, userId, name, password, username, type) {
        const updated = await prisma.password.updateMany({
            where: {
                id: passwordId,
                vaultId,
                userId,
            },
            data: {
                name,
                password,
                username,
                type,
            },
        });
        if (!updated.count) return null;
        return await prisma.password.findUnique({
            where: { id: passwordId },
            select: {
                id: true,
                name: true,
                username: true,
                type: true,
                createdAt: true,
            },
        });
    }

    async deletePassword(vaultId, passwordId, userId) {
        return await prisma.password.deleteMany({
            where: {
                id: passwordId,
                vaultId,
                userId,
            },
        });
    }
}

export default new PasswordRepository();
