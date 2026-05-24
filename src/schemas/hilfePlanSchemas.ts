import { z } from 'zod';

const goalSchema = z.object({
    goal: z.string().min(1),
    status: z.enum(['offen', 'in Bearbeitung', 'erreicht']).default('offen'),
});

export const createHilfePlanSchema = z.object({
    content: z.string().min(1),
    goals: z.array(goalSchema).default([]),
});

export const updateHilfePlanSchema = z.object({
    content: z.string().min(1).optional(),
    goals: z.array(goalSchema).optional(),
});

export type CreateHilfePlanInput = z.infer<typeof createHilfePlanSchema>;
export type UpdateHilfePlanInput = z.infer<typeof updateHilfePlanSchema>;
