import FormularioRutina from '@/components/rutinas/FormularioRutina';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default async function AgregarRutinaPage() {
  const session = await auth();

  if (!session || !session.user?.email) {
    redirect('/');
  }

  // Obtenemos los emails permitidos según el rol
  const { data: autorizados, error } = await supabase
    .from('usuarios')
    .select('email')
    .in('rol', ['entrenador', 'administrador']);

  if (error || !autorizados) {
    console.error('Error obteniendo lista de correos permitidos:', error?.message);
    redirect('/');
  }

  const emailsPermitidos = autorizados.map(u => u.email);
  const emailUsuario = session.user.email;

  if (!emailsPermitidos.includes(emailUsuario)) {
    redirect('/');
  }

  // Render normal si pasó la validación
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Añadir Rutina</CardTitle>
          <CardDescription>Registrar una nueva rutina.</CardDescription>
        </CardHeader>
        <CardContent>
          <FormularioRutina />
        </CardContent>
      </Card>
    </div>
  );
}
