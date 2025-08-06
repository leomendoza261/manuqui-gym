'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '../ui/skeleton';

interface Rutina {
  id: number;
  nombre: string;
  descripcion: string;
  creada_en: string;
}

export default function TablaRutinas() {
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [loading, setLoading] = useState(true)
  const router = useRouter();

  useEffect(() => {
    fetch('/api/rutinas')
      .then(res => res.json())
      .then(data => setRutinas(data))
      .catch(err => console.error(err));
      setLoading(false)
  }, []);

  const handleClick = (id: number) => {
    router.push(`/rutinas/${id}`);
  };

  if (loading) return <div>
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-full rounded-full" />
        <Skeleton className="h-5 w-full rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[125px] w-full rounded-xl" />
      </CardContent>
    </Card>
  </div>

  return (
    <div className="p-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {rutinas.map(rutina => (
        <Card
          key={rutina.id}
          onClick={() => handleClick(rutina.id)}
          className="p-4 cursor-pointer hover:shadow-lg transition rounded-2xl border"
        >
          <h2 className="text-xl font-semibold">{rutina.nombre}</h2>
          <p className="text-sm text-gray-600">{rutina.descripcion}</p>
          <p className="text-xs text-gray-400 mt-2">Creada el: {new Date(rutina.creada_en).toLocaleDateString()}</p>
        </Card>
      ))}
    </div>
  );
}
