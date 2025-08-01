import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { withAuth } from '@/lib/protected-handler'


interface EjercicioRutina {
    id?: number;
    rutina_id?: number;
    ejercicio_id: number; // <- obligatorio
    series: number;
    repeticiones: number;
    descanso_segundos: number;
    orden: number;
}


export const POST = withAuth(async (req: NextRequest) => {
    const body = await req.json()

    const { rutina_id, ejercicios } = body

    if (!rutina_id || !Array.isArray(ejercicios)) {
        return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }

    // Traer ejercicios actuales de la rutina
    const { data: existentes, error: errorExistentes } = await supabase
        .from('rutina_ejercicios')
        .select('id, ejercicio_id, series, repeticiones, descanso_segundos, orden')
        .eq('rutina_id', rutina_id)

    if (errorExistentes) {
        return NextResponse.json({ error: 'Error al obtener rutina actual' }, { status: 500 })
    }

    // Marcar qué ejercicios ya existen y cuáles no
    const ejerciciosNuevos: EjercicioRutina[] = [];
    const ejerciciosActualizar: EjercicioRutina[] = [];
    const idsActuales = new Set()

    ejercicios.forEach((ejNuevo, index) => {
        const existente = existentes?.find(ej => ej.ejercicio_id === ejNuevo.ejercicio_id)

        if (existente) {
            // Ver si cambió algo (series, repeticiones, descanso o el orden)
            if (
                existente.series !== ejNuevo.series ||
                existente.repeticiones !== ejNuevo.repeticiones ||
                existente.descanso_segundos !== ejNuevo.descanso_segundos ||
                existente.orden !== index
            ) {
                ejerciciosActualizar.push({
                    id: existente.id,
                    ejercicio_id: ejNuevo.ejercicio_id, // <-- esto soluciona el error
                    series: ejNuevo.series,
                    repeticiones: ejNuevo.repeticiones,
                    descanso_segundos: ejNuevo.descanso_segundos,
                    orden: index,
                })
            }
            idsActuales.add(existente.id)
        } else {
            ejerciciosNuevos.push({
                rutina_id,
                ejercicio_id: ejNuevo.ejercicio_id,
                series: ejNuevo.series,
                repeticiones: ejNuevo.repeticiones,
                descanso_segundos: ejNuevo.descanso_segundos,
                orden: index,
            })
        }
    })

    // Ejercicios que ya no están
    const idsAEliminar = existentes
        ?.filter(ej => !idsActuales.has(ej.id))
        .map(ej => ej.id) || []

    // === Ejecutar cambios ===

    // 1. Borrar ejercicios que ya no están
    if (idsAEliminar.length > 0) {
        const { error: errorDelete } = await supabase
            .from('rutina_ejercicios')
            .delete()
            .in('id', idsAEliminar)
        if (errorDelete) {
            return NextResponse.json({ error: 'Error al eliminar ejercicios' }, { status: 500 })
        }
    }

    // 2. Insertar nuevos
    if (ejerciciosNuevos.length > 0) {
        const { error: errorInsert } = await supabase
            .from('rutina_ejercicios')
            .insert(ejerciciosNuevos)
        if (errorInsert) {
            return NextResponse.json({ error: 'Error al insertar ejercicios nuevos' }, { status: 500 })
        }
    }

    // 3. Actualizar los existentes que cambiaron
    for (const ej of ejerciciosActualizar) {
        const { error: errorUpdate } = await supabase
            .from('rutina_ejercicios')
            .update({
                series: ej.series,
                repeticiones: ej.repeticiones,
                descanso_segundos: ej.descanso_segundos,
                orden: ej.orden,
            })
            .eq('id', ej.id)

        if (errorUpdate) {
            return NextResponse.json({ error: 'Error al actualizar ejercicios' }, { status: 500 })
        }
    }

    return NextResponse.json({ message: 'Rutina actualizada correctamente' }, { status: 200 })
})
