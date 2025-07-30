// app/api/rutinas/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // tu config de supabase

export const GET = async () => {
  const { data, error } = await supabase
    .from('rutinas')
    .select('*');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
};
