import { Router } from 'express';
import { protect, adminOnly } from '#middlewares';
import { getWorkload, getClientHours } from '#controllers';

const router = Router();

router.use(protect);

router.get('/workload', adminOnly, getWorkload);
router.get('/clients/:id/hours', getClientHours);

export default router;
