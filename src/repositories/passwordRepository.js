import knex from '../db/knex.js';

class PasswordRepository {
    async getPasswords(vaultId, userId) {
        return await knex('passwords')
            .where({ vault_id: vaultId, user_id: userId })
            .select('id', 'name', 'username', 'type', 'created_at');
    }

    async createPassword(vaultId, userId, name, password, username, type) {
        return await knex('passwords').insert({
            vault_id: vaultId,
            user_id: userId,
            name,
            password,
            username,
            type,
        }).returning(['id', 'name', 'username', 'type', 'created_at']);
    }

    async updatePassword(vaultId, passwordId, userId, name, password, username, type) {
        return await knex('passwords')
            .where({ id: passwordId, vault_id: vaultId, user_id: userId })
            .update({
                name,
                password,
                username,
                type,
            })
            .returning(['id', 'name', 'username', 'type', 'created_at']);
    }

    async deletePassword(vaultId, passwordId, userId) {
        return await knex('passwords')
            .where({ id: passwordId, vault_id: vaultId, user_id: userId })
            .del();
    }
}

export default new PasswordRepository();
