import { Router } from 'express';
import {
    getAppointments,
    createAppointment,
    getAppointment,
    updateAppointment,
    deleteAppointment,
} from '#controllers';
import { protect, validateBody } from '#middlewares';
import { createAppointmentSchema, updateAppointmentSchema } from '#schemas';

// mergeParams: true → :clientId aus dem Parent-Router ist verfügbar
const router = Router({ mergeParams: true });

router.use(protect);

router.get('/', getAppointments);
router.post('/', validateBody(createAppointmentSchema), createAppointment);

router.get('/:id', getAppointment);
router.patch('/:id', validateBody(updateAppointmentSchema), updateAppointment);
router.delete('/:id', deleteAppointment);

export default router;
