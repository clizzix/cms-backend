import type { RequestHandler } from 'express';
import { startOfISOWeek, endOfISOWeek } from 'date-fns';
import { Client } from '#models';
import { Appointment } from '#models';
import { User } from '#models';

// GET /stats/workload  (Admin only)
// Gibt für jede Fachkraft: zugewiesene Klienten + Minuten der aktuellen Woche
export const getWorkload: RequestHandler = async (_req, res, next) => {
    try {
        const weekStart = startOfISOWeek(new Date());
        const weekend = endOfISOWeek(new Date());

        // Alle aktiven Klienten mit ihren zugewiesenen FKs
        const clients = await Client.find({ status: 'aktiv' })
            .select('familyName assignedFachkraefte weeklyHoursQuota')
            .lean();
        // Alle durchgeführten Termine dieser Woche
        const appointments = await Appointment.find({
            status: 'durchgeführt',
            date: { $gte: weekStart, $lte: weekend },
        })
            .select('clientId durationHours durationMinutes createdBy')
            .lean();
        // Alle Fachkräfte
        const fachkraefte = await User.find({ role: 'fachkraft' })
            .select('firstName lastName email')
            .lean();

        const workload = fachkraefte.map((fk) => {
            const fkId = fk._id.toString();

            const assignedClients = clients.filter((c) =>
                c.assignedFachkraefte.map(String).includes(fkId),
            );

            // Gesamtquota der zugewiesenen Klienten
            const quotaMinutes = assignedClients.reduce(
                (sum, c) => sum + c.weeklyHoursQuota * 60,
                0,
            );

            // Geleistete Minuten: Termine, bei denen diese FK eingetragen hat
            // UND der Klient ihr zugewiesen ist
            const assignedClientIds = new Set(
                assignedClients.map((c) => c._id.toString()),
            );

            const workedMinutes = appointments
                .filter(
                    (a) =>
                        a.createdBy.toString() === fkId &&
                        assignedClientIds.has(a.clientId.toString()),
                )
                .reduce(
                    (sum, a) => sum + a.durationHours * 60 + a.durationMinutes,
                    0,
                );

            const utilizationPercent =
                quotaMinutes > 0
                    ? Math.round((workedMinutes / quotaMinutes) * 100)
                    : 0;

            return {
                fachkraft: {
                    id: fkId,
                    name: `${fk.firstName} ${fk.lastName}`,
                    email: fk.email,
                },
                clientCount: assignedClients.length,
                quotaMinutes,
                workedMinutes,
                utilizationPercent,
            };
        });
        res.json({ data: workload });
    } catch (err) {
        next(err);
    }
};

// GET /stats/clients/:id/hours  (Admin + zugewiesene FK)
export const getClientHours: RequestHandler<{ id: string }> = async (
    req,
    res,
    next,
) => {
    try {
        const weekStart = startOfISOWeek(new Date());
        const weekEnd = endOfISOWeek(new Date());

        const client = await Client.findById(req.params.id).lean();
        if (!client) {
            res.status(404).json({ message: 'Klient nicht gefunden' });
            return;
        }

        if (req.role === 'fachkraft') {
            const isAssigned = client.assignedFachkraefte
                .map(String)
                .includes(req.userId!);
            if (!isAssigned) {
                res.status(403).json({ message: 'Kein Zugriff' });
                return;
            }
        }

        const appointments = await Appointment.find({
            clientId: req.params.id,
            status: 'durchgeführt',
            date: { $gte: weekStart, $lte: weekEnd },
        })
            .select('durationHours durationMinutes date type')
            .lean();

        const totalMinutes = appointments.reduce(
            (sum, a) => sum + a.durationHours * 60 + a.durationMinutes,
            0,
        );

        const quotaMinutes = client.weeklyHoursQuota * 60;
        const progressPercent =
            quotaMinutes > 0
                ? Math.round((totalMinutes / quotaMinutes) * 100)
                : 0;

        res.json({
            data: {
                clientId: client._id,
                familyName: client.familyName,
                weeklyHoursQuota: client.weeklyHoursQuota,
                quotaMinutes,
                totalMinutes,
                progressPercent,
                appointments,
            },
        });
    } catch (error) {}
};
