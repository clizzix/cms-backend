import { z } from 'zod';

const objectId = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Ungültige ID');

const childSchema = z.object({
    name: z.string().min(1, 'Name wird benötigt'),
    age: z.number().int().min(0).max(99),
});

export const statusSchema = z.enum(['aktiv', 'pausiert', 'abgeschlossen']);

export const createClientSchema = z.object({
    familyName: z.string().min(1, 'Nachname wird benötigt'),
    firstName: z.string().min(1, 'Vorname wird benötigt'),
    caseNumber: z.string().optional(),
    children: z.array(childSchema).default([]),
    address: z.string().optional(),
    jugendamtContact: z.string().min(1, 'Jugendamt Kontakt benötigt'),
    assignedFachkraefte: z.array(objectId).default([]),
    nextReport: z.coerce.date(),
    weeklyHourseQuota: z.number().min(0),
    status: statusSchema.default('aktiv'),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
});

export const updateClientSchema = createClientSchema.partial();

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
