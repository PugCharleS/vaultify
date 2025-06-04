import vaultService from '../services/vaultService.js';
import { Buffer } from 'buffer';

export const createVault = async (req, res, next) => {
    const { name } = req.body;
    const userId = req.user.id;
    const userEmail = req.user.email;

    if (!name) {
        return res.status(400).json({ data: { error: 'Vault name is required' } });
    }

    try {
        const result = await vaultService.insertVault(userId, name, userEmail);
        const vault = result[0];

        res.status(201).json({
            data: {
                message: 'Vault created successfully',
                vault
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getVaults = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const vaultsWithSharedInfo = await vaultService.fetchVaultsWithSharedInfo(userId);
        res.status(200).json({ data: { vaults: vaultsWithSharedInfo } });
    } catch (error) {
        next(error);
    }
};

export const getVaultById = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { vaultId } = req.params;
        const vaultWithSharedInfo = await vaultService.fetchVaultWithSharedInfoById(vaultId, userId);

        if (!vaultWithSharedInfo) {
            return res.status(403).json({ data: { error: 'Vault does not belong to the user or does not exist' } });
        }

        res.status(200).json({ data: { vault: vaultWithSharedInfo } });
    } catch (error) {
        next(error);
    }
};

export const deleteVault = async (req, res, next) => {
    const { vaultId } = req.params;
    const userId = req.user.id;

    try {
        const vault = await vaultService.fetchVaultByOwnerId(vaultId, userId);
        if (!vault) {
            return res.status(403).json({ data: { error: 'Vault does not belong to the user' } });
        }

        await vaultService.deleteVaultAndAssociations(vaultId);

        res.status(200).json({ data: { message: 'Vault and all associated records deleted successfully' } });
    } catch (error) {
        next(error);
    }
};

export const shareVault = async (req, res, next) => {
    const { email, vaultId } = req.params;
    const userId = req.user.id;

    try {
        const vault = await vaultService.fetchVaultByOwnerId(vaultId, userId);
        if (!vault) {
            return res.status(403).json({ data: { error: 'Vault does not belong to the user' } });
        }

        const userToShare = await vaultService.fetchUserByEmail(email);
        if (!userToShare) {
            return res.status(404).json({ data: { error: 'User to share not found' } });
        }

        await vaultService.insertVaultUser(vaultId, userToShare.id);

        res.status(200).json({ data: { message: 'Vault shared successfully' } });
    } catch (error) {
        next(error);
    }
};

export const generateEnvFile = async (req, res, next) => {
    const { vaultId } = req.params;
    const userId = req.user.id;

    try {
        const vaultData = await vaultService.fetchVaultPasswords(vaultId, userId);

        if (!vaultData) {
            return res.status(403).json({ data: { error: 'Vault does not belong to the user or does not exist' } });
        }

        const envContent = vaultData
            .map(({ name, password }) => `${name.toUpperCase()}=${password}`)
            .join('\n');

        res.setHeader('Content-disposition', 'attachment; filename=vault.env');
        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send(Buffer.from(envContent));
    } catch (error) {
        next(error);
    }
};
