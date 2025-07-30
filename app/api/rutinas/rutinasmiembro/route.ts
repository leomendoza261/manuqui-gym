// app/api/rutinas/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { withAuth } from '@/lib/protected-handler';
import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

export const GET = withAuth(async (_req: NextRequest, session) => {
  const sesion = await auth();

  if (!sesion?.user?.email) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  // Buscar ID del usuario por su email
  const { data: usuario, error: errorUsuario } = await supabase
    .from('usuarios')
    .select('id')
    .eq('email', sesion.user.email)
    .maybeSingle();

  if (errorUsuario) {
    console.error('Error al obtener usuario:', errorUsuario);
    return NextResponse.json({ error: 'Error al obtener usuario' }, { status: 500 });
  }

  if (!usuario) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  }

  // Buscar rutinas con usuario_id = null (plantillas) o usuario_id = id del usuario autenticado
  const { data, error } = await supabase
    .from('rutinas')
    .select('*')
    .or(`usuario_id.is.null,usuario_id.eq.${usuario.id}`);

  if (error) {
    console.error('Error al obtener rutinas:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
});
