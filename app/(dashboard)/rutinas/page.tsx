
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

export default function RutinasPage() {
  return (
    <div>

      <div className="ml-auto flex items-end my-2 gap-2">
        <Link href={'/miembros/agregarmiembro'} >
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Añadir rutina
            </span>
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rutinas</CardTitle>
          <CardDescription>Vista de rutinas y sus ejercicios</CardDescription>
        </CardHeader>
        <CardContent>
          aca va una tabla?
        </CardContent>
      </Card>

    </div>
  );
}
