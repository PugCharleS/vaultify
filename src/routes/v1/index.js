import { Router } from 'express';
import authRoutes from './authRoutes.js';
import vaultRoutes from './vaultRoutes.js';
import passwordRoutes from './passwordRoutes.js';
import { combinedAuth, verifyAppsmithSignature } from '../../middlewares/authMiddleware.js';

const router = Router();

router.use('/auth', verifyAppsmithSignature, authRoutes);
router.use('/vaults', combinedAuth, vaultRoutes);
router.use('/passwords', combinedAuth, passwordRoutes);

export default router;