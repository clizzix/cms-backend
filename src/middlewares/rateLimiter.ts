import rateLimit from 'express-rate-limit';

export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
        message: ' Zu viele Versuche - bitte in 15 Minuten erneut versuchen',
    },
});
