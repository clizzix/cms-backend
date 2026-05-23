import { Router } from 'express';
import {
    getClients,
    createClient,
    getClient,
    updateClient,
    assignFachkraft,
    unassignFachkraft,
} from '#controllers';
import { protect, adminOnly, validateBody } from '#middlewares';
import {
    createClientSchema,
    updateClientSchema,
    assignedFachkraefteSchema,
} from '#schemas';

const router = Router();

router.use(protect);

router.get('/', getClients);
router.get('/:id', getClient);

router.post('/', adminOnly, validateBody(createClientSchema), createClient);
router.patch('/:id', validateBody(updateClientSchema), updateClient);

router.post(
    '/:id/assign',
    adminOnly,
    validateBody(assignedFachkraefteSchema),
    assignFachkraft,
);
router.delete('/:id/assign/:fachkraftId', adminOnly, unassignFachkraft);

export default router;
