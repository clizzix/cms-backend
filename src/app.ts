import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {
    authRoutes,
    userRoutes,
    clientRoutes,
    appointmentRoutes,
    hilfeplanRoutes,
    statsRoutes,
} from '#routes';
import { errorHandler } from '#middlewares';

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    }),
);

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/clients', clientRoutes);
app.use('/api/v1/clients/:clientId/appointments', appointmentRoutes);
app.use('/api/v1/clients/:clientId/hilfeplan', hilfeplanRoutes);
app.use('/api/v1/stats', statsRoutes);

app.use('*splat', (req, res) => res.status(404).json({ message: 'Not Found' }));
app.use(errorHandler);

export default app;
