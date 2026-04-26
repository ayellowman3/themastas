import { getPairingScoreState, saveHoleScore } from '../../../lib/score-db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pairingId = searchParams.get('pairingId');

  if (!pairingId) {
    return Response.json({ error: 'pairingId is required' }, { status: 400 });
  }

  return Response.json(getPairingScoreState(pairingId));
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body?.pairingId || !body?.side || typeof body?.hole !== 'number') {
    return Response.json({ error: 'pairingId, side, and hole are required' }, { status: 400 });
  }

  const score =
    body.score === null || body.score === ''
      ? null
      : Number.isFinite(Number(body.score))
        ? Number(body.score)
        : null;

  saveHoleScore({
    pairingId: body.pairingId,
    side: body.side,
    hole: body.hole,
    score,
    playerName: typeof body.playerName === 'string' && body.playerName.length > 0 ? body.playerName : null,
  });

  return Response.json({ ok: true });
}
