'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import Image from 'next/image'
import { Skeleton } from '../ui/skeleton'
import { TextoFormateado } from '@/lib/FormatearInstrucciones'

interface Ejercicio {
  id: number;
  rutina_id: number;
  series: number;
  repeticiones: number;
  descanso_segundos: number;
  orden: number;
  ejercicios: {
    id: number;
    nombre: string;
    descripcion: string;
    grupo_muscular: string;
    tipo: string;
    imagen_url: string;
    video_url: string;
    ejecucion: string;
    consejos: string;
  };
}
interface Props {
  rutina_id: number;
}

export default function TablaRutinaEjercicios({ rutina_id }: Props) {
  const [selectedExercise, setSelectedExercise] = useState<Ejercicio | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!rutina_id) return

    const fetchData = async () => {
      const res = await fetch(`/api/rutinas/${rutina_id}/ejercicios`)
      const data = await res.json()
      setEjercicios(data)
      setLoading(false)
    }

    fetchData()
  }, [rutina_id])

  if (loading) return (
    <div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-full rounded-full" />
          <Skeleton className="h-5 w-full rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[125px] w-full rounded-xl mt-2" />
        </CardContent>
      </Card>
    </div>);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Rutina de Pecho</CardTitle>
          <CardDescription>Haz clic en un ejercicio para ver el detalle.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Ejercicio</TableCell>
                <TableCell>Descripción</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ejercicios.map((ejercicio) => (
                <TableRow
                  key={ejercicio.id}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedExercise(ejercicio)
                    setIsOpen(true)
                  }}
                >
                  <TableCell>
                    <Image
                      src={ejercicio.ejercicios.imagen_url}
                      alt={ejercicio.ejercicios.nombre}
                      width={100}
                      height={100}
                      className="rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <p className="font-bold text-base">{ejercicio.ejercicios.nombre}</p>
                    <p><span className="text-xs text-muted-foreground">
                      {ejercicio.series} series x {ejercicio.repeticiones} reps
                    </span></p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {selectedExercise && (
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
              <DrawerContent>
                <div className="mx-auto w-full max-w-sm max-h-[80vh] overflow-y-auto px-4">

                  <DrawerHeader>
                    <DrawerTitle>{selectedExercise.ejercicios.nombre}</DrawerTitle>
                    <DrawerDescription>
                      Grupo muscular: {selectedExercise.ejercicios.grupo_muscular}
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4 pb-0">
                    <Image
                      src={selectedExercise.ejercicios.imagen_url}
                      alt={selectedExercise.ejercicios.nombre}
                      width={500}
                      height={300}
                      className="rounded"
                    />
                    <p className='text-lg font-semibold my-1'>Preparación</p>
                    <p>{selectedExercise.ejercicios.descripcion}</p>
                    <p className='text-lg font-semibold my-1'>Ejecucion</p>
                    <TextoFormateado texto={selectedExercise.ejercicios.ejecucion}/>
                    <p className='text-lg font-semibold my-1'>Consejos Clave</p>
                    <TextoFormateado texto={selectedExercise.ejercicios.consejos} />
                    <p className='text-lg font-semibold my-1'>Detalle</p>
                    <p>Series: {selectedExercise.series}</p>
                    <p>Repeticiones: {selectedExercise.repeticiones}</p>
                    <p>Descanso: {selectedExercise.descanso_segundos} seg</p>
                  </div>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button>Listo</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
