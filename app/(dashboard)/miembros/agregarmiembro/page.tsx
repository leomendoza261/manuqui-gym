import FormularioMiembro from '@/components/FormularioMiembro';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';


export default async function AgregarMiembroPage() {

  const session = await auth();

  if (!session || session.user?.email !== "pedrolmendoza031297@gmail.com") {
    redirect('/');
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Añadir Miembro</CardTitle>
          <CardDescription>Registrar un nuevo miembro.</CardDescription>
        </CardHeader>
        <CardContent>
          <FormularioMiembro />
        </CardContent>
      </Card>
    </div>
  );
}