// lib/protected-handler.ts
import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export function withAuth(handler: (req: NextRequest, session: any) => Promise<NextResponse>) {
  return async function (req: NextRequest) {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    return handler(req, session);
  };
}
