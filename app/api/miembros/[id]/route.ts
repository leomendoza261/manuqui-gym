import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/protected-handler';

export const GET = withAuth(async (_req: NextRequest, _session: any, context?: { params?: { id?: string } }) => {
  const id = context?.params?.id;

  if (!id) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  // Buscar usuario por ID
  const { data: usuario, error: errorUsuario } = await supabase
    .from('usuarios')
    .select(`*, tipos_sangre (tipo)`)
    .eq('id', id)
    .maybeSingle();

  if (errorUsuario) {
    console.error('Error al obtener usuario:', errorUsuario);
    return NextResponse.json({ error: 'Error al obtener usuario' }, { status: 500 });
  }

  if (!usuario) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  }

  // Buscar la membresía más reciente del usuario
  const { data: membresia, error: errorMembresia } = await supabase
    .from('membresias')
    .select('fecha_inicio, fecha_fin, estado')
    .eq('usuario_id', id)
    .order('fecha_inicio', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (errorMembresia) {
    console.error('Error al obtener membresía:', errorMembresia);
    return NextResponse.json({ error: 'Error al obtener membresía' }, { status: 500 });
  }

  return NextResponse.json({
    ...usuario,
    tipo_sangre: usuario.tipos_sangre?.tipo ?? null,
    membresia: membresia ?? null,
  });
});
