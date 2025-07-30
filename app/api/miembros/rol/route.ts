import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { withAuth } from '@/lib/protected-handler'
import { NextRequest } from 'next/server'

export const GET = withAuth(async (req: NextRequest, session) => {
  const { searchParams } = new URL(req.url)
  const rolParam = searchParams.get('rol') // puede ser: "entrenador", "entrenador,administrador", etc.

  let query = supabase.from('usuarios').select('id, nombre, apellido, rol')

  if (rolParam) {
    const roles = rolParam.split(',').map(r => r.trim())
    query = query.in('rol', roles)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
})
