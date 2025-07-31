import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // ajusta esto a tu cliente Supabase real
import { withAuth } from '@/lib/protected-handler';

export const GET = withAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;
 
  const { data, error } = await supabase
    .from('rutina_ejercicios')
    .select(`
      id,
      rutina_id,
      series,
      repeticiones,
      descanso_segundos,
      orden,
      ejercicios (
        id,
        nombre,
        descripcion,
        grupo_muscular,
        tipo,
        imagen_url,
        video_url,
        ejecucion,
        consejos
      )
    `)
    .eq('rutina_id', id)
    .order('orden', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
})
