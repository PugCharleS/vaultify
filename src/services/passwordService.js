import passwordRepository from '../repositories/passwordRepository.js';
import { encrypt, decrypt } from '../utils/encryption.js';

class PasswordService {
    async getPasswords(vaultId, userId) {
        const records = await passwordRepository.getPasswords(vaultId, userId);
        return records.map(r => {
            if (r.password) {
                return { ...r, password: decrypt(r.password) };
            }
            return r;
        });
    }

    async createPassword(vaultId, userId, name, password, username, type) {
        const encrypted = encrypt(password);
        return await passwordRepository.createPassword(vaultId, userId, name, encrypted, username, type);
    }

    async updatePassword(vaultId, passwordId, userId, name, password, username, type) {
        return await passwordRepository.updatePassword(vaultId, passwordId, userId, name, password, username, type);
    }

    async deletePassword(vaultId, passwordId, userId) {
        return await passwordRepository.deletePassword(vaultId, passwordId, userId);
    }
}

export default new PasswordService();
