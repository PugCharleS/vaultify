import { Router } from 'express';
import { createVault, getVaults, getVaultById, shareVault, deleteVault } from '../../controllers/vaultController.js';

const router = Router({ mergeParams: true });

router.post('/', createVault);
router.get('/', getVaults);
router.get('/:vaultId', getVaultById);
router.post('/share/:email/vault/:vaultId', shareVault);
router.delete('/:vaultId', deleteVault);

export default router;
