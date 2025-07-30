
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
} from "@/components/ui/table"
import Link from 'next/link';

export default function RutinasPage() {
  return (
    <div>

      <div className="ml-auto flex items-end my-2 gap-2">
        <Link href={'/rutinas/agregarrutina'} >
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
          <Table>
            <TableCaption></TableCaption>
            <TableHeader>
              <TableRow>
                {/* <TableHead className="w-[100px]">Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Rutina de pecho</TableCell>
                <TableCell className="text-right">creado por: Emanuel</TableCell>
                <TableCell className="text-right">82 miembro</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Rutina de piernas</TableCell>
                <TableCell />
                <TableCell className="text-right">122 miembro</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Rutina de espalda</TableCell>
                <TableCell />
                <TableCell className="text-right">44 miembro</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Rutina de piernas de Camila Ferreyra</TableCell>
                <TableCell className="text-right">creado por: Cristian</TableCell>
                <TableCell className="text-right">1 miembro</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Rutina de brazos de Camila Ferreyra</TableCell>
                <TableCell className="text-right">creado por: Cristian</TableCell>
                <TableCell className="text-right">1 miembro</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}
