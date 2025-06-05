import prisma from '../db/prisma.js';
import VaultRepository from '../repositories/vaultRepository.js';

class VaultService {
    constructor(vaultRepository = new VaultRepository(prisma)) {
        this.vaultRepository = vaultRepository;
    }

    async insertVault(userId, name, userEmail) {
        return await this.vaultRepository.insertVault(userId, name, userEmail);
    }

    async fetchVaultsWithSharedInfo(userId) {
        const vaults = await this.vaultRepository.fetchVaultsByUserId(userId);
        return await Promise.all(vaults.map(async vault => {
            const sharedUsers = await this.vaultRepository.fetchSharedUsersByVaultId(vault.id);
            return {
                ...vault,
                sharedWith: sharedUsers.map(user => user.email),
            };
        }));
    }

    async fetchVaultWithSharedInfoById(vaultId, userId) {
        const vault = await this.vaultRepository.fetchVaultByIdAndUserId(vaultId, userId);
        if (!vault) {
            return null;
        }
        const sharedUsers = await this.vaultRepository.fetchSharedUsersByVaultId(vault.id);
        return {
            ...vault,
            sharedWith: sharedUsers.map(user => user.email),
        };
    }

    async fetchVaultByIdAndUserId(vaultId, userId) {
        return await this.vaultRepository.fetchVaultByIdAndUserId(vaultId, userId);
    }

    async fetchVaultByOwnerId(vaultId, userId) {
        return await this.vaultRepository.fetchVaultByIdAndOwnerId(vaultId, userId);
    }

    async deleteVaultAndAssociations(vaultId) {
        return await this.vaultRepository.deleteVaultAndAssociations(vaultId);
    }

    async fetchUserByEmail(email) {
        return await this.vaultRepository.fetchUserByEmail(email);
    }

    async insertVaultUser(vaultId, userId) {
        return await this.vaultRepository.insertVaultUser(vaultId, userId);
    }

    async fetchVaultPasswords(vaultId, userId) {
        const vault = await this.vaultRepository.fetchVaultByIdAndUserId(vaultId, userId);
        if (!vault) {
            return null;
        }
        return await this.vaultRepository.fetchPasswordsByVaultId(vaultId);
    }
}

export { VaultService };
export default new VaultService();
