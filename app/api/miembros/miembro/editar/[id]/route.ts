import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/protected-handler';
import { usuarioEsEntrenadorOAdmin } from '@/lib/permissions';


export const PUT = withAuth(async (req: NextRequest, session) => {
  try {
    
    const body = await req.json();

    const {
      id,
      email,
      nombre,
      apellido,
      dni,
      fecha_nacimiento,
      tipo_sangre_id,
      telefono,
      rol
    } = body;

    const email_user = session.user.email;

    const tienePermiso = await usuarioEsEntrenadorOAdmin(email_user);
    if (!tienePermiso) {
      return NextResponse.json({ error: 'Acceso no autorizado' }, { status: 403 });
    }

    // Validación mínima
    if (!id || !email || !rol) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const { error } = await supabase
      .from('usuarios')
      .update({
        email,
        nombre,
        apellido,
        dni,
        fecha_nacimiento,
        tipo_sangre_id,
        telefono,
        rol
      })
      .eq('id', id);

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Usuario actualizado' }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
})
