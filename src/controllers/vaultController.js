import vaultService from '../services/vaultService.js';
import { Buffer } from 'buffer';

/**
 * @openapi
 * /vaults:
 *   post:
 *     summary: Create a new vault
 *     tags:
 *       - Vaults
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Vault created
 */
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

/**
 * @openapi
 * /vaults:
 *   get:
 *     summary: Retrieve all vaults
 *     tags:
 *       - Vaults
 *     responses:
 *       '200':
 *         description: List of vaults
 */
export const getVaults = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const vaultsWithSharedInfo = await vaultService.fetchVaultsWithSharedInfo(userId);
        res.status(200).json({ data: { vaults: vaultsWithSharedInfo } });
    } catch (error) {
        next(error);
    }
};

/**
 * @openapi
 * /vaults/{vaultId}:
 *   get:
 *     summary: Get a vault by ID
 *     tags:
 *       - Vaults
 *     parameters:
 *       - in: path
 *         name: vaultId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Vault data
 */
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

/**
 * @openapi
 * /vaults/{vaultId}:
 *   delete:
 *     summary: Delete a vault
 *     tags:
 *       - Vaults
 *     parameters:
 *       - in: path
 *         name: vaultId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Vault deleted
 */
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

/**
 * @openapi
 * /vaults/share/{email}/vault/{vaultId}:
 *   post:
 *     summary: Share a vault with another user
 *     tags:
 *       - Vaults
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: vaultId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Vault shared
 */
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

/**
 * @openapi
 * /vaults/{vaultId}/env:
 *   get:
 *     summary: Export vault passwords to an env file
 *     tags:
 *       - Vaults
 *     parameters:
 *       - in: path
 *         name: vaultId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: env file
 */
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
