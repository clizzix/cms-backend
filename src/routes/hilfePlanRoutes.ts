import { Router } from 'express';
import { protect, validateBody } from '#middlewares';
import { getHilfePlan, createHilfePlan, updateHilfePlan } from '#controllers';
import { createHilfePlanSchema, updateHilfePlanSchema } from '#schemas';

const router = Router({ mergeParams: true });

router.use(protect);

router
    .get('/', getHilfePlan)
    .post('/', validateBody(createHilfePlanSchema), createHilfePlan)
    .patch('/', validateBody(updateHilfePlanSchema), updateHilfePlan);

export default router;
