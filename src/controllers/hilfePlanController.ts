import type { RequestHandler } from 'express';
import { Hilfeplan, Client } from '#models';
import { resolveClientAccess } from '#utils';
import type { CreateHilfePlanInput, UpdateHilfePlanInput } from '#schemas';

type ClientParams = { clientId: string };

// GET /clients/:clientId/hilfeplan
export const getHilfePlan: RequestHandler<ClientParams> = async (
    req,
    res,
    next,
) => {
    try {
        const access = await resolveClientAccess(
            req.params.clientId,
            req.userId!,
            req.role!,
        );
        if (!access.ok) {
            res.status(access.status).json({ message: access.message });
            return;
        }

        const plan = await Hilfeplan.findOne({
            clientId: req.params.clientId,
        }).lean();
        if (!plan) {
            res.status(404).json({ message: 'Kein Hilfeplan gefunden' });
            return;
        }
        res.json({ data: plan });
    } catch (err) {
        next(err);
    }
};

// POST /clients/:clientId/hilfeplan
export const createHilfePlan: RequestHandler<
    ClientParams,
    unknown,
    CreateHilfePlanInput
> = async (req, res, next) => {
    try {
        const access = await resolveClientAccess(
            req.params.clientId,
            req.userId!,
            req.role!,
        );
        if (!access.ok) {
            res.status(access.status).json({ message: access.message });
            return;
        }

        const existing = await Hilfeplan.findOne({
            clientId: req.params.clientId,
        });
        if (existing) {
            res.status(409).json({
                message: 'Hilfeplan existiert bereits. Bitte PATCH verwenden',
            });
            return;
        }

        const plan = await Hilfeplan.create({
            clientId: req.params.clientId,
            createdBy: req.userId,
            content: req.body.content,
            goals: req.body.goals,
            version: 1,
        });

        res.status(201).json({ data: plan });
    } catch (err) {
        next(err);
    }
};

// PATCH /clients/:clientId/hilfeplan
export const updateHilfePlan: RequestHandler<
    ClientParams,
    unknown,
    UpdateHilfePlanInput
> = async (req, res, next) => {
    try {
        const access = await resolveClientAccess(
            req.params.clientId,
            req.userId!,
            req.role!,
        );
        if (!access.ok) {
            res.status(access.status).json({ message: access.message });
            return;
        }

        const plan = await Hilfeplan.findOne({ clientId: req.params.clientId });
        if (!plan) {
            res.status(404).json({ message: 'Kein Hilfeplan gefunden' });
            return;
        }

        if (req.body.content !== undefined) plan.content = req.body.content;
        if (req.body.goals !== undefined) plan.goals = req.body.goals;
        plan.version += 1;

        await plan.save();
        res.json({ data: plan });
    } catch (err) {
        next(err);
    }
};
