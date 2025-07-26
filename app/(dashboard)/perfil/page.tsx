import PerfilUsuario from '@/components/PerfilUsuario';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import Image from 'next/image';
import { auth } from '@/lib/auth';

export default async function PerfilPage() {

  let session = await auth();
  let user = session?.user;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mi Perfil</CardTitle>
        <CardDescription>Mi informacion personal</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-4">
          <Image
            src={user?.image ?? '/placeholder-user.jpg'}
            width={72}
            height={72}
            alt="Avatar"
            className="overflow-hidden rounded-full"
          />
        </div>
        <PerfilUsuario />
      </CardContent>
    </Card>
  );
}
