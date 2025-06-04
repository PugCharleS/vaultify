import prisma from '../db/prisma.js';

class VaultRepository {
    async insertVault(userId, name, userEmail) {
        return await prisma.vault.create({
            data: {
                userId,
                name,
                createdBy: userEmail,
            },
            select: {
                id: true,
                name: true,
                createdAt: true,
                createdBy: true,
            },
        });
    }

    async fetchVaultsByUserId(userId) {
        return await prisma.vault.findMany({
            where: { userId },
            select: {
                id: true,
                name: true,
                createdAt: true,
                createdBy: true,
            },
        });
    }

    async fetchSharedUsersByVaultId(vaultId) {
        const records = await prisma.vaultUser.findMany({
            where: { vaultId },
            include: {
                user: {
                    select: { email: true },
                },
            },
        });
        return records.map(r => r.user);
    }

    async fetchVaultByIdAndUserId(vaultId, userId) {
        return await prisma.vault.findFirst({
            where: {
                id: vaultId,
                OR: [
                    { userId },
                    { vaultUsers: { some: { userId } } },
                ],
            },
        });
    }

    async fetchVaultByIdAndOwnerId(vaultId, userId) {
        return await prisma.vault.findFirst({
            where: {
                id: vaultId,
                userId,
            },
        });
    }

    async deleteVaultAndAssociations(vaultId) {
        return await prisma.$transaction([
            prisma.password.deleteMany({ where: { vaultId } }),
            prisma.vaultUser.deleteMany({ where: { vaultId } }),
            prisma.vault.delete({ where: { id: vaultId } }),
        ]);
    }

    async fetchUserByEmail(email) {
        return await prisma.user.findUnique({ where: { email } });
    }

    async insertVaultUser(vaultId, userId) {
        return await prisma.vaultUser.create({
            data: {
                vaultId,
                userId,
            },
        });
    }

    async fetchPasswordsByVaultId(vaultId) {
        return await prisma.password.findMany({
            where: { vaultId },
            select: { name: true, password: true },
        });
    }
}

export default new VaultRepository();
