'use client';

import { GoogleIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-muted justify-center items-start md:items-center p-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
          <CardDescription>
            Usá tu cuenta de Google para iniciar sesión.
          </CardDescription>
        </CardHeader>

        <CardFooter>

          <Button
            className="w-full"
            onClick={() => signIn('google', { callbackUrl: '/' })}
          >
            <GoogleIcon className="mt-2 mr-2"/>
            Iniciar sesión con Google
            
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
