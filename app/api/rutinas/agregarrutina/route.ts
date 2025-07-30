import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { withAuth } from '@/lib/protected-handler'
import { NextRequest } from 'next/server'

export const POST = withAuth(async (req: NextRequest, session) => {
  try {
    const body = await req.json()

    const { nombre, creador_id, miembro_id, ejercicios } = body

    // 1. Insertar la rutina
    const { data: rutinaInsertada, error: errorRutina } = await supabase
      .from('rutinas')
      .insert({
        nombre,
        entrenador_id: creador_id,
        usuario_id: miembro_id,
        creada_en: new Date().toISOString()
      })
      .select('id') // Traemos el ID de la rutina insertada

    if (errorRutina) {
      return NextResponse.json({ error: errorRutina.message }, { status: 500 })
    }

    const rutina_id = rutinaInsertada?.[0]?.id

    if (!rutina_id) {
      return NextResponse.json({ error: 'No se pudo obtener el ID de la rutina' }, { status: 500 })
    }

    // 2. Preparar los ejercicios con rutina_id
    const ejerciciosAInsertar = ejercicios.map((ejercicio: any) => ({
      rutina_id,
      ejercicio_id: ejercicio.ejercicio_id,
      series: ejercicio.series,
      repeticiones: ejercicio.repeticiones
    }))

    // 3. Insertar ejercicios en rutina_ejercicios
    const { error: errorEjercicios } = await supabase
      .from('rutina_ejercicios')
      .insert(ejerciciosAInsertar)

    if (errorEjercicios) {
      return NextResponse.json({ error: errorEjercicios.message }, { status: 500 })
    }

    return NextResponse.json({ mensaje: 'Rutina registrada exitosamente', rutina_id }, { status: 201 })

  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
})
