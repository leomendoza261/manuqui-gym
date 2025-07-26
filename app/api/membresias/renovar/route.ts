import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log('Datos recibidos en el API:', body);

        const { id_membresia, nuevo_inicio, nuevo_fin, tipo } = body;

        if (!id_membresia || !nuevo_inicio || !nuevo_fin || !tipo) {
            return NextResponse.json({ error: 'Faltan datos obligatorios.' }, { status: 400 });
        }

        const { error } = await supabase
            .from('membresias')
            .update({
                fecha_inicio: nuevo_inicio,
                fecha_fin: nuevo_fin,
                tipo,
                estado: 'activa', // Cambiás a activa automáticamente
            })
            .eq('id', id_membresia);

        if (error) {
            console.error('Error al renovar membresía:', error);
            return NextResponse.json({ error: 'Error al actualizar la membresía.' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Error en el servidor:', err);
        return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
    }
}
