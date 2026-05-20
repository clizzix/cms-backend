import { z } from 'zod';

export const registerSchema = z.object({
    firstName: z.string().min(1, 'Vorname wird benötigt'),
    lastName: z.string().min(1, 'Nachname wird benötigt'),
    email: z.email('Ungültige E-Mail'),
    password: z.string().min(8, 'Mindestens 8 Zeichen'),
});

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(1),
});

export const changeEmailSchema = z.object({
    email: z.email('Ungültige E-Mail'),
    currentPassword: z.string().min(1, 'required'),
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'required'),
    newPassword: z.string().min(8, 'Mindestens 8 Zeichen'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
