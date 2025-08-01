import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// Esta versión admite tanto APIs con solo req/session como con req/session/context
export function withAuth(
  handler: (
    req: NextRequest,
    session: any,
    context?: { params?: { [key: string]: string } }
  ) => Promise<NextResponse>
) {
  return async function (
    req: NextRequest,
    context: { params?: { [key: string]: string } } = {} // contexto opcional
  ) {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    return handler(req, session, context);
  };
}
