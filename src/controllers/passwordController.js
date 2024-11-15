import passwordService from "../services/passwordService.js";

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
