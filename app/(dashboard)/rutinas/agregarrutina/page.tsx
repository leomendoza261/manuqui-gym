
import FormularioRutina from '@/components/rutinas/FormularioRutina';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';


export default function AgregarRutinaPage() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Añadir Rutina</CardTitle>
          <CardDescription>Registrar una nueva rutina.</CardDescription>
        </CardHeader>
        <CardContent>
            <FormularioRutina />
        </CardContent>
      </Card>
    </div>
  );
}