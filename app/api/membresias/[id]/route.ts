// app/api/membresias/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { withAuth } from '@/lib/protected-handler';
 
export const GET = withAuth(async (
  _req: NextRequest,
  context: { params: { id: string } } // 👈 Esto es correcto para App Router
) => {
  const id = context.params.id;

  if (!id) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('membresias')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: 'Membresía no encontrada' }, { status: 404 });
  }

  return NextResponse.json(data);
})
