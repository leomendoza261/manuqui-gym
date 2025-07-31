// app/api/rutinas/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { withAuth } from '@/lib/protected-handler';
import { NextRequest } from 'next/server';
import { usuarioEsEntrenadorOAdmin } from '@/lib/permissions';

export const GET = withAuth(async (_req: NextRequest, session) => {

  const email_user = session.user.email;
  
      const tienePermiso = await usuarioEsEntrenadorOAdmin(email_user);
      if (!tienePermiso) {
        return NextResponse.json({ error: 'Acceso no autorizado' }, { status: 403 });
      }

  const { data, error } = await supabase.from('rutinas').select('*')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}) 