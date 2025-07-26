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

export default function MiembrosPage() {
  return (
    <div>

      <Card>
        <CardHeader>
          <CardTitle>Mis rutinas</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
            Proximamente
        </CardContent>
      </Card>

    </div>
  );
}
