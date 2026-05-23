import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '#controllers';
import { protect, adminOnly, validateBody } from '#middlewares';
import { createUserSchema, updateUserSchema } from '#schemas';

const router = Router();

router.use(protect, adminOnly);

router.get('/', getUsers);
router.post('/', validateBody(createUserSchema), createUser);
router.patch('/:id', validateBody(updateUserSchema), updateUser);
router.delete('/:id', deleteUser);

export default router;
