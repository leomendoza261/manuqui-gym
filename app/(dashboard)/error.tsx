'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleX } from 'lucide-react';
import { useEffect } from 'react';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>ERROR</CardTitle>
          <CardDescription>Ha ocurrido un error.</CardDescription>
        </CardHeader>
        <CardContent>
            <CircleX className='h-20 w-20 text-red-600'/>
            <span className='text-red-600'>Error 500: error interno del servidor.</span>
        </CardContent>
      </Card>
    </main>
  );
}
