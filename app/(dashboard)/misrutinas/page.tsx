import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import Image from 'next/image';
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

          <Image
            src="https://manuqui-gym.pedrolmendoza031297.workers.dev/Flexion.webp"
            alt="Press de banca"
            width={500}
            height={300}
          />

        </CardContent>
      </Card>

    </div>
  );
}
