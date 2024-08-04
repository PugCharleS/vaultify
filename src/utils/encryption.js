import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);

export const encrypt = (text) => {
    const iv = crypto.randomBytes(16); // Generar un IV único para cada cifrado
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex'); // Almacenar IV junto con texto cifrado
};

export const decrypt = (text) => {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex'); // Extraer IV
    const encryptedText = Buffer.from(textParts.join(':'), 'hex'); // Extraer texto cifrado
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};
