declare namespace Express {
    interface Request {
        userId?: string;
        role?: 'admin' | 'fachkraft';
    }
}
