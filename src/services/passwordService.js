import passwordRepository from '../repositories/passwordRepository.js';

class PasswordService {
    async getPasswords(vaultId, userId) {
        return await passwordRepository.getPasswords(vaultId, userId);
    }

    async createPassword(vaultId, userId, name, password, username, type) {
        return await passwordRepository.createPassword(vaultId, userId, name, password, username, type);
    }

    async updatePassword(vaultId, passwordId, userId, name, password, username, type) {
        return await passwordRepository.updatePassword(vaultId, passwordId, userId, name, password, username, type);
    }

    async deletePassword(vaultId, passwordId, userId) {
        return await passwordRepository.deletePassword(vaultId, passwordId, userId);
    }
}

export default new PasswordService();
