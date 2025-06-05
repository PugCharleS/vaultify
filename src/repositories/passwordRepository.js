import BaseRepository from './baseRepository.js';

class PasswordRepository extends BaseRepository {
    constructor(prisma) {
        super(prisma, 'password');
    }

    async getPasswords(vaultId, userId) {
        return await this.findMany(
            { vaultId, userId },
            { id: true, name: true, username: true, type: true, createdAt: true }
        );
    }

    async createPassword(vaultId, userId, name, password, username, type) {
        return await this.create(
            { vaultId, userId, name, password, username, type },
            { id: true, name: true, username: true, type: true, createdAt: true }
        );
    }

    async updatePassword(vaultId, passwordId, userId, name, password, username, type) {
        const updated = await this.updateMany(
            { id: passwordId, vaultId, userId },
            { name, password, username, type }
        );
        if (!updated.count) return null;
        return await this.findUnique(
            { id: passwordId },
            { id: true, name: true, username: true, type: true, createdAt: true }
        );
    }

    async deletePassword(vaultId, passwordId, userId) {
        return await this.deleteMany({ id: passwordId, vaultId, userId });
    }
}

export default PasswordRepository;
