import { Router } from 'express';
import { protect } from '#middlewares';
import { getDocuments } from '#controllers';

const router = Router({ mergeParams: true });

router.get('/', protect, getDocuments);

export default router;
