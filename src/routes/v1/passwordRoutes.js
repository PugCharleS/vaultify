import { Router } from 'express';
import { createPassword, getPasswords } from '../../controllers/passwordController.js';

const router = Router();

router.post('/:vault/passwords', createPassword);
router.get('/:vault/passwords', getPasswords);

export default router;
