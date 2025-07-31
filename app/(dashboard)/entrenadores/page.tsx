import TablaMembresias from '@/components/TablaMembresias';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function EntrenadoresPage() {

  const session = await auth();

  if (!session || session.user?.email !== "pedrolmendoza031297@gmail.com") {
    redirect('/');
  }

  return (
    <div>

      <div className="ml-auto flex items-end my-2 gap-2">
        <Link href={'/miembros/agregarmiembro'} >
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Añadir miembro
            </span>
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Entrenadores</CardTitle>
          <CardDescription>Vista de entrenadores y sus membresias</CardDescription>
        </CardHeader>
        <CardContent>
          <TablaMembresias />
        </CardContent>
      </Card>

    </div>
  );
}
