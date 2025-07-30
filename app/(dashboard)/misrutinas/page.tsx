'use client'

import TablaRutinas from '@/components/misrutinas/TablaRutinas'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

export default function MisRutinasPage() {

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Mis Rutinas</CardTitle>
          <CardDescription>Listado de rutinas.</CardDescription>
        </CardHeader>
        <CardContent>
          <TablaRutinas />
        </CardContent>
      </Card>
    </div>
  )
}
