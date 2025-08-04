import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { withAuth } from '@/lib/protected-handler';
import { NextRequest } from 'next/server';
import { usuarioEsEntrenadorOAdmin } from '@/lib/permissions';

export const POST = withAuth(async (_req: NextRequest, session) => {
    try {
        const body = await _req.json()
        const {
            nombre,
            apellido,
            dni,
            email,
            fecha_nacimiento,
            telefono,
            tipo_sangre_id,
            rol,
            creado_en = new Date().toISOString(),
            tipo_membresia,
            fecha_inicio,
            fecha_fin,
            pase_membresia,
        } = body;

        const email_user = session.user.email;

        const tienePermiso = await usuarioEsEntrenadorOAdmin(email_user);
        if (!tienePermiso) {
            return NextResponse.json({ error: 'Acceso no autorizado' }, { status: 403 });
        }

        // 1. Insertar el nuevo usuario y obtener su ID
        const { data: usuarioInsertado, error: insertError } = await supabase
            .from('usuarios')
            .insert([{
                nombre,
                apellido,
                dni,
                email,
                fecha_nacimiento,
                telefono,
                tipo_sangre_id,
                rol,
                creado_en
            }])
            .select('id')  // recupera el id insertado

        if (insertError) throw insertError

        const usuario_id = usuarioInsertado?.[0]?.id
        if (!usuario_id) throw new Error('No se pudo obtener el ID del nuevo usuario')

        // 2. Insertar membresía asociada
        const { error: membresiaError } = await supabase
            .from('membresias')
            .insert([{
                usuario_id,
                tipo: tipo_membresia,
                fecha_inicio,
                fecha_fin,
                estado: 'activa',
                pase_membresia
            }])

        if (membresiaError) throw membresiaError

        return NextResponse.json({ ok: true, mensaje: 'Miembro y membresía registrados correctamente' })

    } catch (error) {
        console.error('Error registrando miembro:', error)
        return NextResponse.json({ error: 'Hubo un error al registrar el miembro y su membresía' }, { status: 500 })
    }
})
