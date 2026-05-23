import { Client } from '#models';

type AccessOk = {
    ok: true;
    client: NonNullable<Awaited<ReturnType<typeof Client.findById>>>;
};
type AccessFail = { ok: false; status: number; message: string };
export type AccessResult = AccessOk | AccessFail;

export const resolveClientAccess = async (
    clientId: string,
    userId: string,
    role: 'admin' | 'fachkraft',
): Promise<AccessResult> => {
    const client = await Client.findById(clientId);

    if (!client) {
        return { ok: false, status: 404, message: 'Klient nicht gefunden' };
    }
    if (role === 'fachkraft') {
        const isAssigned = client.assignedFachkraefte.some(
            (fk) => fk.toString() === userId,
        );
        if (!isAssigned) {
            return {
                ok: false,
                status: 403,
                message: 'Kein Zugriff auf diesen Klienten',
            };
        }
    }

    return { ok: true, client };
};
