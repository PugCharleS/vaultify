import knex from '../db/knex.js';

class VaultRepository {
    async insertVault(userId, name, userEmail) {
        return await knex('vaults').insert({
            user_id: userId,
            name,
            created_by: userEmail,
        }).returning(['id', 'name', 'created_at', 'created_by']);
    }

    async fetchVaultsByUserId(userId) {
        return await knex('vaults').where({ user_id: userId }).select('id', 'name', 'created_at', 'created_by');
    }

    async fetchSharedUsersByVaultId(vaultId) {
        return await knex('vault_users')
            .where('vault_id', vaultId)
            .join('users', 'vault_users.user_id', 'users.id')
            .select('users.email');
    }

    async fetchVaultByIdAndUserId(vaultId, userId) {
        return await knex('vaults')
            .where({ id: vaultId })
            .andWhere(function () {
                this.where('user_id', userId).orWhereIn('id', function () {
                    this.select('vault_id').from('vault_users').where('user_id', userId);
                });
            })
            .first();
    }

    async deleteVaultAndAssociations(vaultId) {
        return await knex.transaction(async trx => {
            await trx('passwords').where({ vault_id: vaultId }).del();
            await trx('vault_users').where({ vault_id: vaultId }).del();
            await trx('vaults').where({ id: vaultId }).del();
        });
    }

    async fetchUserByEmail(email) {
        return await knex('users').where({ email }).first();
    }

    async insertVaultUser(vaultId, userId) {
        return await knex('vault_users').insert({
            vault_id: vaultId,
            user_id: userId,
        });
    }

    async fetchPasswordsByVaultId(vaultId) {
        return await knex('passwords')
            .where('vault_id', vaultId)
            .select('name', 'password');
    }
}

export default new VaultRepository();
