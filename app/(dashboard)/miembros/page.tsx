import TablaMembresias from '@/components/TablaMembresias';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function MiembrosPage() {
  return (
    <div>

      <div className="ml-auto flex items-end my-2 gap-2">
        <Link href={'/miembros/agregarmiembro'} >
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Añadir articulo
            </span>
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Miembros</CardTitle>
          <CardDescription>View all customers and their orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <TablaMembresias />
        </CardContent>
      </Card>

    </div>
  );
}
