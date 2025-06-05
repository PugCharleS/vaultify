import test from 'node:test';
import assert from 'node:assert/strict';

process.env.ENCRYPTION_KEY = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const { encrypt, decrypt } = await import('../src/utils/encryption.js');
const passwordService = (await import('../src/services/passwordService.js')).default;
const passwordRepository = (await import('../src/repositories/passwordRepository.js')).default;

test('createPassword encrypts password before saving', async () => {
  let savedPassword;
  passwordRepository.createPassword = async (vaultId, userId, name, password, username, type) => {
    savedPassword = password;
    return { id: 1, name, username, type, createdAt: new Date() };
  };

  await passwordService.createPassword(1, 2, 'Example', 'plain', 'user', 'type');

  assert.notEqual(savedPassword, 'plain');
  assert.equal(decrypt(savedPassword), 'plain');
});

test('getPasswords decrypts retrieved passwords', async () => {
  const encrypted = encrypt('secret');
  passwordRepository.getPasswords = async () => [{ id: 1, name: 'Example', username: 'user', type: 'type', createdAt: new Date(), password: encrypted }];

  const results = await passwordService.getPasswords(1, 2);

  assert.equal(results[0].password, 'secret');
});
