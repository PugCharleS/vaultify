import vaultRepository from '../repositories/vaultRepository.js';

class VaultService {
    async insertVault(userId, name, userEmail) {
        return await vaultRepository.insertVault(userId, name, userEmail);
    }

    async fetchVaultsWithSharedInfo(userId) {
        const vaults = await vaultRepository.fetchVaultsByUserId(userId);
        return await Promise.all(vaults.map(async vault => {
            const sharedUsers = await vaultRepository.fetchSharedUsersByVaultId(vault.id);
            return {
                ...vault,
                sharedWith: sharedUsers.map(user => user.email),
            };
        }));
    }

    async fetchVaultWithSharedInfoById(vaultId, userId) {
        const vault = await vaultRepository.fetchVaultByIdAndUserId(vaultId, userId);
        if (!vault) {
            return null;
        }
        const sharedUsers = await vaultRepository.fetchSharedUsersByVaultId(vault.id);
        return {
            ...vault,
            sharedWith: sharedUsers.map(user => user.email),
        };
    }

    async fetchVaultByIdAndUserId(vaultId, userId) {
        return await vaultRepository.fetchVaultByIdAndUserId(vaultId, userId);
    }

    async fetchVaultByOwnerId(vaultId, userId) {
        return await vaultRepository.fetchVaultByIdAndOwnerId(vaultId, userId);
    }

    async deleteVaultAndAssociations(vaultId) {
        return await vaultRepository.deleteVaultAndAssociations(vaultId);
    }

    async fetchUserByEmail(email) {
        return await vaultRepository.fetchUserByEmail(email);
    }

    async insertVaultUser(vaultId, userId) {
        return await vaultRepository.insertVaultUser(vaultId, userId);
    }

    async fetchVaultPasswords(vaultId, userId) {
        const vault = await vaultRepository.fetchVaultByIdAndUserId(vaultId, userId);
        if (!vault) {
            return null;
        }
        return await vaultRepository.fetchPasswordsByVaultId(vaultId);
    }
}

export default new VaultService();
