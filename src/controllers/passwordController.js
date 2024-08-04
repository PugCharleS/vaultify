import knex from '../db/knex.js';
import { encrypt, decrypt } from '../utils/encryption.js';

export const createPassword = async (req, res) => {
    const { vaultId, name, password } = req.body;
    const userId = req.user.id;

    if (!vaultId || !name || !password) {
        return res.status(400).json({ message: 'Vault ID, name, and password are required' });
    }

    try {
        const encryptedPassword = encrypt(password);

        const [newPassword] = await knex('passwords').insert({
            vault_id: vaultId,
            name,
            password: encryptedPassword,
            added_by: userId
        }).returning(['id', 'name', 'created_at']);

        res.status(201).json({ password: newPassword });
    } catch (error) {
        res.status(500).json({ message: 'Error creating password', error });
    }
};

export const getPasswords = async (req, res) => {
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
            .select('id', 'name', 'password', 'created_at');

        const decryptedPasswords = passwords.map(pwd => ({
            ...pwd,
            password: decrypt(pwd.password)
        }));

        res.status(200).json({ passwords: decryptedPasswords });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving passwords', error });
    }
};
