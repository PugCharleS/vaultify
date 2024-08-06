import knex from '../db/knex.js';
import { encrypt, decrypt } from '../utils/encryption.js';

export const getPasswords = async (req, res, next) => {
    const { vaultId } = req.params;
    const userId = req.user.id;

    try {
        const vault = await knex('vaults')
            .where({ id: vaultId })
            .andWhere(function () {
                this.where('user_id', userId).orWhereIn('id', function () {
                    this.select('vault_id').from('vault_users').where('user_id', userId);
                });
            })
            .first();

        if (!vault) {
            return res.status(403).json({ message: 'Vault does not belong to the user or does not exist' });
        }

        const passwords = await knex('passwords')
            .where({ vault_id: vaultId })
            .select('id', 'name', 'username', 'type', 'password', 'created_at', 'added_by');

        const decryptedPasswords = await Promise.all(passwords.map(async pwd => {
            const user = await knex('users').where({ id: pwd.added_by }).first();
            return {
                ...pwd,
                password: decrypt(pwd.password),
                username: decrypt(pwd.username),
                added_by_email: user.email
            };
        }));

        res.status(200).json({ passwords: decryptedPasswords });
    } catch (error) {
        next(error);
    }
};

export const createPassword = async (req, res, next) => {
    const { name, password, username, type } = req.body;
    const { vaultId } = req.params;
    const userId = req.user.id;

    if (!vaultId || !name || !password || !username || !type) {
        return res.status(400).json({ message: 'Vault ID, name, password, username, and type are required' });
    }

    try {
        const encryptedPassword = encrypt(password);
        const encryptedUsername = encrypt(username);

        const [newPassword] = await knex('passwords').insert({
            vault_id: vaultId,
            name,
            password: encryptedPassword,
            username: encryptedUsername,
            type,
            added_by: userId
        }).returning(['id', 'name', 'username', 'type', 'created_at', 'added_by']);

        res.status(201).json({ message: "Password created successfully" });
    } catch (error) {
        next(error);
    }
};

export const updatePassword = async (req, res, next) => {
    const { vaultId, passwordId } = req.params;
    const { name, password, username, type } = req.body;
    const userId = req.user.id;

    if (!vaultId || !passwordId || !name || !password || !username || !type) {
        return res.status(400).json({ message: 'Vault ID, Password ID, name, password, username, and type are required' });
    }

    try {
        const vault = await knex('vaults')
            .where({ id: vaultId })
            .andWhere(function () {
                this.where('user_id', userId).orWhereIn('id', function () {
                    this.select('vault_id').from('vault_users').where('user_id', userId);
                });
            })
            .first();

        if (!vault) {
            return res.status(403).json({ message: 'Vault does not belong to the user or does not exist' });
        }

        const encryptedPassword = encrypt(password);
        const encryptedUsername = encrypt(username);

        const updatedPassword = await knex('passwords')
            .where({ id: passwordId, vault_id: vaultId })
            .update({
                name,
                password: encryptedPassword,
                username: encryptedUsername,
                type
            })
            .returning(['id', 'name', 'username', 'type', 'created_at', 'added_by']);

        res.status(200).json({ message: 'Password updated successfully', password: updatedPassword });
    } catch (error) {
        next(error);
    }
};

export const deletePassword = async (req, res, next) => {
    const { vaultId, passwordId } = req.params;
    const userId = req.user.id;

    try {
        const vault = await knex('vaults')
            .where({ id: vaultId })
            .andWhere(function () {
                this.where('user_id', userId).orWhereIn('id', function () {
                    this.select('vault_id').from('vault_users').where('user_id', userId);
                });
            })
            .first();

        if (!vault) {
            return res.status(403).json({ message: 'Vault does not belong to the user or does not exist' });
        }

        const deleted = await knex('passwords')
            .where({ id: passwordId, vault_id: vaultId })
            .del();

        if (deleted) {
            res.status(200).json({ message: 'Password deleted successfully' });
        } else {
            res.status(404).json({ message: 'Password not found' });
        }
    } catch (error) {
        next(error);
    }
};
