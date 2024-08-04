import knex from '../db/knex.js';


export const createVault = async (req, res) => {
    const { name } = req.body;
    const userId = req.user.id;
    const userEmail = req.user.email;

    if (!name) {
        return res.status(400).json({ message: 'Vault name is required' });
    }

    try {
        const [vault] = await knex('vaults').insert({
            user_id: userId,
            name,
            created_by: userEmail,
        }).returning(['id', 'name', 'created_at', 'created_by']);

        res.status(201).json({ vault });
    } catch (error) {
        res.status(500).json({ message: 'Error creating vault', error });
    }
};


export const getVaults = async (req, res) => {
    const userId = req.user.id;

    try {
        const vaults = await knex('vaults').where({ user_id: userId }).select('id', 'name', 'created_at', 'created_by');

        const vaultsWithSharedInfo = await Promise.all(vaults.map(async vault => {
            const sharedUsers = await knex('vault_users')
                .where('vault_id', vault.id)
                .join('users', 'vault_users.user_id', 'users.id')
                .select('users.email');

            return {
                ...vault,
                sharedWith: sharedUsers.map(user => user.email),
            };
        }));

        res.status(200).json({ vaults: vaultsWithSharedInfo });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving vaults', error });
    }
};

export const getVaultById = async (req, res) => {
    const userId = req.user.id;
    const { vaultId } = req.params;

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

        const sharedUsers = await knex('vault_users')
            .where('vault_id', vault.id)
            .join('users', 'vault_users.user_id', 'users.id')
            .select('users.email');

        const vaultWithSharedInfo = {
            ...vault,
            sharedWith: sharedUsers.map(user => user.email),
        };

        res.status(200).json({ vault: vaultWithSharedInfo });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving vault', error });
    }
};

export const deleteVault = async (req, res) => {
    const { vaultId } = req.params;
    const userId = req.user.id;

    try {
        const vault = await knex('vaults').where({ id: vaultId, user_id: userId }).first();
        if (!vault) {
            return res.status(403).json({ message: 'Vault does not belong to the user' });
        }

        await knex.transaction(async trx => {
            await trx('passwords').where({ vault_id: vaultId }).del();

            await trx('vault_users').where({ vault_id: vaultId }).del();

            await trx('vaults').where({ id: vaultId }).del();
        });

        res.status(200).json({ message: 'Vault and all associated records deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting vault', error });
    }
};

export const shareVault = async (req, res) => {
    const { email, vaultId } = req.params;
    const userId = req.user.id;

    try {
        const vault = await knex('vaults').where({ id: vaultId, user_id: userId }).first();
        if (!vault) {
            return res.status(403).json({ message: 'Vault does not belong to the user' });
        }

        const userToShare = await knex('users').where({ email }).first();
        if (!userToShare) {
            return res.status(404).json({ message: 'User to share not found' });
        }

        await knex('vault_users').insert({
            vault_id: vaultId,
            user_id: userToShare.id,
        });

        res.status(200).json({ message: 'Vault shared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error sharing vault', error });
    }
};
