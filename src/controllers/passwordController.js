import passwordService from "../services/passwordService.js";

/**
 * @openapi
 * /passwords/{vaultId}:
 *   get:
 *     summary: Retrieve passwords for a vault
 *     tags:
 *       - Passwords
 *     parameters:
 *       - in: path
 *         name: vaultId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: List of passwords
 */
export const getPasswords = async (req, res, next) => {
    const { vaultId } = req.params;
    const userId = req.user.id;

    try {
        const passwords = await passwordService.getPasswords(vaultId, userId);
        res.status(200).json({ data: { passwords } });
    } catch (error) {
        next(error);
    }
};

/**
 * @openapi
 * /passwords/{vaultId}:
 *   post:
 *     summary: Add a password to a vault
 *     tags:
 *       - Passwords
 *     parameters:
 *       - in: path
 *         name: vaultId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Password created
 */
export const createPassword = async (req, res, next) => {
    const { name, password, username, type } = req.body;
    const { vaultId } = req.params;
    const userId = req.user.id;

    if (!vaultId || !name || !password || !username || !type) {
        return res.status(400).json({ data: { error: 'Vault ID, name, password, username, and type are required' } });
    }

    try {
        const newPassword = await passwordService.createPassword(vaultId, userId, name, password, username, type);
        res.status(201).json({ data: { message: "Password created successfully", password: newPassword } });
    } catch (error) {
        next(error);
    }
};

/**
 * @openapi
 * /passwords/{vaultId}/{passwordId}:
 *   put:
 *     summary: Update a password
 *     tags:
 *       - Passwords
 *     parameters:
 *       - in: path
 *         name: vaultId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: passwordId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Password updated
 */
export const updatePassword = async (req, res, next) => {
    const { vaultId, passwordId } = req.params;
    const { name, password, username, type } = req.body;
    const userId = req.user.id;

    if (!vaultId || !passwordId || !name || !password || !username || !type) {
        return res.status(400).json({ data: { error: 'Vault ID, Password ID, name, password, username, and type are required' } });
    }

    try {
        const updatedPassword = await passwordService.updatePassword(vaultId, passwordId, userId, name, password, username, type);
        res.status(200).json({ data: { message: 'Password updated successfully', password: updatedPassword } });
    } catch (error) {
        next(error);
    }
};

/**
 * @openapi
 * /passwords/{vaultId}/{passwordId}:
 *   delete:
 *     summary: Delete a password
 *     tags:
 *       - Passwords
 *     parameters:
 *       - in: path
 *         name: vaultId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: passwordId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Password deleted
 */
export const deletePassword = async (req, res, next) => {
    const { vaultId, passwordId } = req.params;
    const userId = req.user.id;

    try {
        await passwordService.deletePassword(vaultId, passwordId, userId);
        res.status(200).json({ data: { message: 'Password deleted successfully' } });
    } catch (error) {
        next(error);
    }
};
