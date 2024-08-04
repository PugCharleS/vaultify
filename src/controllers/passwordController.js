import knex from '../db/knex.js';
import { encrypt, decrypt } from '../utils/encryption.js';

export const createPassword = async (req, res) => {
    const { name, password } = req.body;
    const { vault } = req.params;
    const userId = req.user.id;
    const userEmail = req.user.email;

    if (!name || !password) {
        return res.status(400).json({ message: 'Name and password are required' });
    }

    try {
        // Verificar que la bóveda pertenece al usuario autenticado
        const vaultExists = await knex('vaults')
            .where({ id: vault, user_id: userId })
            .orWhereIn('id', function () {
                this.select('vault_id').from('vault_users').where('user_id', userId);
            })
            .first();

        if (!vaultExists) {
            return res.status(403).json({ message: 'Vault does not belong to the user' });
        }

        // Cifrar la contraseña antes de almacenarla
        const encryptedPassword = encrypt(password);

        // Crear la contraseña dentro de la bóveda
        const [newPassword] = await knex('passwords').insert({
            vault_id: vault,
            name,
            password: encryptedPassword,
            added_by: userEmail, // Almacenar el correo del usuario que agregó la contraseña
        }).returning(['id', 'vault_id', 'name', 'created_at', 'added_by']);

        res.status(201).json({ password: newPassword });
    } catch (error) {
        res.status(500).json({ message: 'Error creating password', error });
    }
};

export const getPasswords = async (req, res) => {
    const { vault } = req.params;
    const userId = req.user.id;

    try {
        // Verificar que la bóveda pertenece al usuario autenticado o que la bóveda ha sido compartida con el usuario
        const vaultAccess = await knex('vaults')
            .where({ id: vault, user_id: userId })
            .orWhereIn('id', function () {
                this.select('vault_id').from('vault_users').where('user_id', userId);
            })
            .first();

        if (!vaultAccess) {
            return res.status(403).json({ message: 'Vault does not belong to the user' });
        }

        // Obtener las contraseñas de la bóveda
        const passwords = await knex('passwords')
            .where({ vault_id: vault })
            .select('id', 'name', 'password', 'created_at', 'added_by');

        // Descifrar las contraseñas antes de enviarlas al cliente
        const decryptedPasswords = passwords.map(password => ({
            ...password,
            password: decrypt(password.password)
        }));

        res.status(200).json({ passwords: decryptedPasswords });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error retrieving passwords', error });
    }
};
