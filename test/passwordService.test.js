import test from 'node:test';
import assert from 'node:assert/strict';

process.env.ENCRYPTION_KEY = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const { encrypt, decrypt } = await import('../src/utils/encryption.js');
const { PasswordService } = await import('../src/services/passwordService.js');

test('createPassword encrypts password before saving', async () => {
  let savedPassword;
  const mockRepository = {
    createPassword: async (vaultId, userId, name, password, username, type) => {
      savedPassword = password;
      return { id: 1, name, username, type, createdAt: new Date() };
    }
  };
  const service = new PasswordService(mockRepository);

  await service.createPassword(1, 2, 'Example', 'plain', 'user', 'type');

  assert.notEqual(savedPassword, 'plain');
  assert.equal(decrypt(savedPassword), 'plain');
});

test('getPasswords decrypts retrieved passwords', async () => {
  const encrypted = encrypt('secret');
  const mockRepository = {
    getPasswords: async () => [{ id: 1, name: 'Example', username: 'user', type: 'type', createdAt: new Date(), password: encrypted }]
  };
  const service = new PasswordService(mockRepository);

  const results = await service.getPasswords(1, 2);

  assert.equal(results[0].password, 'secret');
});
