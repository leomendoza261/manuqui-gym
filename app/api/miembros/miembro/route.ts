import { auth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export const GET = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  // Obtener usuario con tipo de sangre
  const { data: usuario, error: errorUsuario } = await supabase
    .from('usuarios')
    .select(`*,
      tipos_sangre (
        tipo
      )
    `)
    .eq('email', session.user.email)
    .maybeSingle();

  if (errorUsuario) {
    console.error('Error al obtener usuario:', errorUsuario);
    return NextResponse.json({ error: 'Error al obtener usuario' }, { status: 500 });
  }

  if (!usuario) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  }

  // Obtener membresía más reciente del usuario
  const { data: membresia, error: errorMembresia } = await supabase
    .from('membresias')
    .select('fecha_inicio, fecha_fin, estado')
    .eq('usuario_id', usuario.id)
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
};
