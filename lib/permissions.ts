// lib/permissions.ts
import { supabase } from '@/lib/supabase';

export async function usuarioEsEntrenadorOAdmin(email: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('usuarios')
    .select('email')
    .in('rol', ['entrenador', 'administrador']);

  if (error || !data) return false;

  return data.some(u => u.email === email);
}


/* //como llamarlo en un page
import { usuarioEsEntrenadorOAdmin } from '@/lib/permissions';
// ...
if (!(await usuarioEsEntrenadorOAdmin(session.user.email))) {
  redirect('/');
}
 */