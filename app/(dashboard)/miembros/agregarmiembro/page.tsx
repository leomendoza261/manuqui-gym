import FormularioMiembro from '@/components/FormularioMiembro';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';


export default function AgregarMiembroPage() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Añadir Miembro</CardTitle>
          <CardDescription>Registrar un nuevo miembro.</CardDescription>
        </CardHeader>
        <CardContent>
            <FormularioMiembro />
        </CardContent>
      </Card>
    </div>
  );
}