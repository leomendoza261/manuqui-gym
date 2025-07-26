import { supabase } from '@/lib/supabase'; 
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
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
}
