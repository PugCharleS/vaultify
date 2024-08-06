import { Router } from 'express';
import { createPassword, getPasswords, deletePassword, updatePassword } from '../../controllers/passwordController.js';

const router = Router();

router.get('/:vaultId', getPasswords);

router.post('/:vaultId', createPassword);

router.put('/:vaultId/:passwordId', updatePassword);

router.delete('/:vaultId/:passwordId', deletePassword);

export default router;
