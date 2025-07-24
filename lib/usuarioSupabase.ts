// lib/usuarioSupabase.ts
import { auth } from '@/lib/auth'; // este está bien
import { supabase } from './supabase';

export async function obtenerDatosUsuario() {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error('Usuario no autenticado');
  }

  // por ejemplo, buscar en la tabla usuarios
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', session.user.email)
    .single();

  if (error) throw error;

  return data;
}
