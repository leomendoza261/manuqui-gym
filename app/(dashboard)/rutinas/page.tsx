import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase'; // acceso directo

export default async function RutinasPage() {
  const session = await auth();

  if (!session || !session.user?.email) {
    redirect('/');
  }

  // Obtenemos los emails autorizados desde la base
  const { data: autorizados, error } = await supabase
    .from('usuarios')
    .select('email')
    .in('rol', ['entrenador', 'administrador']);

  if (error || !autorizados) {
    console.error('Error cargando autorizados:', error?.message);
    redirect('/');
  }

  const emailsPermitidos = autorizados.map(u => u.email);
  const emailUsuario = session.user.email;

  if (!emailsPermitidos.includes(emailUsuario)) {
    redirect('/');
  }

  return (
    <div>
      <div className="ml-auto flex items-end my-2 gap-2">
        <Link href={'/rutinas/agregarrutina'}>
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Añadir rutina</span>
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rutinas</CardTitle>
          <CardDescription>Vista de rutinas y sus ejercicios</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption></TableCaption>
            <TableHeader>
              <TableRow />
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Rutina de pecho</TableCell>
                <TableCell className="text-right">creado por: Emanuel</TableCell>
                <TableCell className="text-right">82 miembro</TableCell>
              </TableRow>
              {/* ... más filas estáticas */}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
