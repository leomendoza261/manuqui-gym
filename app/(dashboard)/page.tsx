import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TablaEntrenadoresDashboard from '@/components/dashboard/entrenador';
import TablaAnunciosDashboard from '@/components/dashboard/anuncios';



export default async function ProductsPage(
  props: {
    searchParams: Promise<{ q: string; offset: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const search = searchParams.q ?? '';
  const offset = searchParams.offset ?? 0;


  return (
    <Tabs defaultValue="Anuncios">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="Anuncios">Anuncios</TabsTrigger>
          <TabsTrigger value="Entrenadores">Entrenadores</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="Anuncios">
        <Card>
          <CardHeader>
            <CardTitle>Anuncios</CardTitle>
          </CardHeader>
          <CardContent>
            <TablaAnunciosDashboard />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="Entrenadores">
        <Card>
          <CardHeader>
            <CardTitle>Entrenadores</CardTitle>
          </CardHeader>
          <CardContent>
            <TablaEntrenadoresDashboard />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
