class PasswordRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPasswords(vaultId, userId) {
        return await this.prisma.password.findMany({
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
        return await this.prisma.password.create({
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
        const updated = await this.prisma.password.updateMany({
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
        return await this.prisma.password.findUnique({
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
        return await this.prisma.password.deleteMany({
            where: {
                id: passwordId,
                vaultId,
                userId,
            },
        });
    }
}

export default PasswordRepository;
