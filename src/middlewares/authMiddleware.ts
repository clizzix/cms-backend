import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
    userId: string;
    role?: 'admin' | 'fachkraft';
}

const protect: RequestHandler = (req, res, next) => {
    let token: string | undefined;

    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res
            .status(401)
            .json({ message: 'Nicht authorisiert, kein token vorhanden' });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET as string,
        ) as TokenPayload;

        req.userId = decoded.userId;
        req.role = decoded.role ?? 'fachkraft';
        next();
    } catch (error) {
        return res
            .status(401)
            .json({ message: 'Nicht authorisiert, token fehlgeschlagen' });
    }
};

export default protect;
