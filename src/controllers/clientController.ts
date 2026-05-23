import type { RequestHandler } from 'express';
import mongoose from 'mongoose';
import { Client, User } from '#models';
import {
    type CreateClientInput,
    type UpdateClientInput,
    type AssignFachkraftInput,
} from '#schemas';

// GET /clients
// Admin → alle Klienten · Fachkraft → nur zugewiesene
export const getClients: RequestHandler = async (req, res) => {
    const filter =
        req.role === 'admin'
            ? {}
            : { assignedFachkraefte: new mongoose.Types.ObjectId(req.userId) };

    const clients = await Client.find(filter)
        .populate('assignedFachkraefte', 'firstName lastName email')
        .sort({ familyName: 1 });

    res.json({ data: { clients } });
};

// POST /clients  (Admin only – via adminOnly Middleware in Routes)
export const createClient: RequestHandler<{}, {}, CreateClientInput> = async (
    req,
    res,
) => {
    const client = await Client.create(req.body);
    res.status(201).json({ data: { client } });
};

// GET /clients/:id
export const getClient: RequestHandler<{ id: string }> = async (req, res) => {
    const client = await Client.findById(req.params.id).populate(
        'assignedFachkraefte',
        'firstName lastName email',
    );

    if (!client) {
        res.status(404).json({ message: 'Klient nicht gefunden' });
        return;
    }
    // Fachkräfte dürfen nur eigene Klienten sehen
    if (req.role === 'fachkraft') {
        const isAssigned = client.assignedFachkraefte.some(
            (fk) => fk._id.toString() === req.userId,
        );
        if (!isAssigned) {
            res.status(403).json({
                message: 'Kein Zugriff auf diesen Klienten',
            });
            return;
        }
    }

    res.json({ data: { client } });
};

// PATCH /clients/:id
export const updateClient: RequestHandler<
    { id: string },
    {},
    UpdateClientInput
> = async (req, res) => {
    const client = await Client.findById(req.params.id);

    if (!client) {
        res.status(404).json({ message: 'Klient nicht gefunden' });
        return;
    }

    if (req.role === 'fachkraft') {
        const isAssigned = client.assignedFachkraefte.some(
            (fk) => fk.toString() === req.userId,
        );
        if (!isAssigned) {
            res.status(403).json({
                message: 'Kein Zugriff auf diesen Klienten',
            });
            return;
        }
    }

    Object.assign(client, req.body);
    await client.save();

    res.json({ data: { client } });
};

// POST /clients/:id/assign  (Admin only)
export const assignFachkraft: RequestHandler<
    { id: string },
    {},
    AssignFachkraftInput
> = async (req, res) => {
    const { fachkraftId } = req.body;

    const [client, fachkraft] = await Promise.all([
        Client.findById(req.params.id),
        User.findById(fachkraftId),
    ]);

    if (!client) {
        res.status(404).json({ message: 'Klient nicht gefunden' });
        return;
    }

    if (!fachkraft || fachkraft.role !== 'fachkraft') {
        res.status(404).json({ message: 'Fachkraft nicht gefunden' });
        return;
    }

    const alreadyAssigned = client.assignedFachkraefte.some(
        (fk) => fk.toString() === fachkraftId,
    );
    if (alreadyAssigned) {
        res.status(409).json({ message: 'Fachkraft bereits zugewiesen' });
        return;
    }

    client.assignedFachkraefte.push(new mongoose.Types.ObjectId(fachkraftId));
    await client.save();

    res.json({ data: { client } });
};

// DELETE /clients/:id/assign/:fachkraftId  (Admin only)

export const unassignFachkraft: RequestHandler<{
    id: string;
    fachkraftId: string;
}> = async (req, res) => {
    const client = await Client.findById(req.params.id);

    if (!client) {
        res.status(404).json({ message: 'Klient nicht gefunden' });
        return;
    }

    const before = client.assignedFachkraefte.length;
    client.assignedFachkraefte = client.assignedFachkraefte.filter(
        (fk) => fk.toString() !== req.params.fachkraftId,
    );

    if (client.assignedFachkraefte.length === before) {
        res.status(404).json({ message: 'Fachkraft war nicht zugewiesen' });
        return;
    }

    await client.save();
    res.json({ data: { client } });
};
