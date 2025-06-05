class VaultRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async insertVault(userId, name, userEmail) {
        return await this.prisma.vault.create({
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
        return await this.prisma.vault.findMany({
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
        const records = await this.prisma.vaultUser.findMany({
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
        return await this.prisma.vault.findFirst({
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
        return await this.prisma.vault.findFirst({
            where: {
                id: vaultId,
                userId,
            },
        });
    }

    async deleteVaultAndAssociations(vaultId) {
        return await this.prisma.$transaction([
            this.prisma.password.deleteMany({ where: { vaultId } }),
            this.prisma.vaultUser.deleteMany({ where: { vaultId } }),
            this.prisma.vault.delete({ where: { id: vaultId } }),
        ]);
    }

    async fetchUserByEmail(email) {
        return await this.prisma.user.findUnique({ where: { email } });
    }

    async insertVaultUser(vaultId, userId) {
        return await this.prisma.vaultUser.create({
            data: {
                vaultId,
                userId,
            },
        });
    }

    async fetchPasswordsByVaultId(vaultId) {
        return await this.prisma.password.findMany({
            where: { vaultId },
            select: { name: true, password: true },
        });
    }
}

export default VaultRepository;
