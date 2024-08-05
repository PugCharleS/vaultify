import { Router } from 'express';
import { createPassword, getPasswords, deletePassword } from '../../controllers/passwordController.js';

const router = Router();

router.get('/:vaultId', getPasswords);

router.post('/:vaultId', createPassword);

router.delete('/:vaultId/:passwordId', deletePassword);

export default router;
