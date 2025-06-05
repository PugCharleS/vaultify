import prisma from '../db/prisma.js';
import PasswordRepository from '../repositories/passwordRepository.js';
import { encrypt, decrypt } from '../utils/encryption.js';

class PasswordService {
    constructor(passwordRepository = new PasswordRepository(prisma)) {
        this.passwordRepository = passwordRepository;
    }

    async getPasswords(vaultId, userId) {
        const records = await this.passwordRepository.getPasswords(vaultId, userId);
        return records.map(r => {
            if (r.password) {
                return { ...r, password: decrypt(r.password) };
            }
            return r;
        });
    }

    async createPassword(vaultId, userId, name, password, username, type) {
        const encrypted = encrypt(password);
        return await this.passwordRepository.createPassword(vaultId, userId, name, encrypted, username, type);
    }

    async updatePassword(vaultId, passwordId, userId, name, password, username, type) {
        return await this.passwordRepository.updatePassword(vaultId, passwordId, userId, name, password, username, type);
    }

    async deletePassword(vaultId, passwordId, userId) {
        return await this.passwordRepository.deletePassword(vaultId, passwordId, userId);
    }
}

export { PasswordService };
export default new PasswordService();
