import PerfilUsuario from '@/components/PerfilUsuario';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default function PerfilPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mi Perfil</CardTitle>
        <CardDescription>View all customers and their orders.</CardDescription>
      </CardHeader>
      <CardContent>
        <PerfilUsuario />
      </CardContent>
    </Card>
  );
}
