'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { GoogleIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push('/');
    } else {
      alert('Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen flex bg-muted justify-center items-center p-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
          <CardDescription>Usá tu correo para iniciar sesión.</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4">
            <div>
              <Label>Correo</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label>Contraseña</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Link className='text-blue-700 text-sm hover:text-blue-500' href={'/register'}>Aun no tienes cuenta? Registráte</Link>
            <Button className="w-full mt-2" onClick={handleLogin}>Iniciar sesión</Button>
            
          </div>
        </CardContent>

        <CardFooter>
          <Button className="w-full" onClick={() => signIn('google', { callbackUrl: '/' })}>
            <GoogleIcon className="mr-2 mt-1" />
            Iniciar sesión con Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
