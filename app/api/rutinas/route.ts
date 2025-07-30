// app/api/rutinas/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { withAuth } from '@/lib/protected-handler';
import { NextRequest } from 'next/server';

export const GET = withAuth(async (_req: NextRequest, session) => {
  const { data, error } = await supabase.from('rutinas').select('*')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}) 