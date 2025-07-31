'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card'
import {
    Table, TableBody, TableCell, TableHeader, TableRow
} from '@/components/ui/table'
import {
    Drawer, DrawerClose, DrawerContent, DrawerDescription,
    DrawerFooter, DrawerHeader, DrawerTitle
} from "@/components/ui/drawer"
import Image from 'next/image'
import { Skeleton } from '../ui/skeleton'
import { TextoFormateado } from '@/lib/FormatearInstrucciones'
import { Input } from '../ui/input'
import { Search, X } from 'lucide-react'

interface Ejercicio {
    id: number;
    nombre: string;
    descripcion: string;
    grupo_muscular: string;
    tipo: string;
    imagen_url: string;
    video_url: string;
    ejecucion: string;
    consejos: string;
}

export default function TablaEjercicios() {
    const [selectedExercise, setSelectedExercise] = useState<Ejercicio | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    const [ejercicios, setEjercicios] = useState<Ejercicio[]>([])
    const [loading, setLoading] = useState(true)

    const [mostrarBuscador, setMostrarBuscador] = useState(false)
    const [textoBusqueda, setTextoBusqueda] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`/api/ejercicios/todos`)
            const data = await res.json()
            setEjercicios(data)
            setLoading(false)
        }

        fetchData()
    }, [])

    const ejerciciosFiltrados = ejercicios.filter(ej =>
        ej.nombre.toLowerCase().includes(textoBusqueda.toLowerCase())
    )

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
        </div>
    )

    return (
        <div className="space-y-2">
            {/* Botón de búsqueda */}


            {/* Input de búsqueda con botón de cerrar */}
            {mostrarBuscador && (
                <div className="relative w-full sm:w-64 mb-2">
                    <Input
                        value={textoBusqueda}
                        onChange={(e) => setTextoBusqueda(e.target.value)}
                        placeholder="Buscar ejercicio por nombre..."
                        className="pr-10 border-gray-500"
                    />
                    {textoBusqueda.length > 0 && (
                        <button
                            onClick={() => setTextoBusqueda("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            )}

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableCell className='p-2'>Imagen</TableCell>
                        <TableCell className="flex justify-between items-center p-2">
                            <span className='pl-2'>
                                Nombre
                            </span>
                            <div >
                                <Button variant="outline" size="icon" onClick={() => setMostrarBuscador(!mostrarBuscador)}>
                                    <Search className="h-4 w-4" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {ejerciciosFiltrados.map((ejercicio) => (
                        <TableRow
                            key={ejercicio.id}
                            className="cursor-pointer"
                            onClick={() => {
                                setSelectedExercise(ejercicio)
                                setIsOpen(true)
                            }}
                        >
                            <TableCell className='p-0'>
                                <Image
                                    src={ejercicio.imagen_url}
                                    alt={ejercicio.nombre}
                                    width={100}
                                    height={100}
                                    className="rounded"
                                />
                            </TableCell>
                            <TableCell>
                                <p className="font-bold text-base">{ejercicio.nombre}</p>
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
                                <DrawerTitle>{selectedExercise.nombre}</DrawerTitle>
                                <DrawerDescription>
                                    Grupo muscular: {selectedExercise.grupo_muscular}
                                </DrawerDescription>
                            </DrawerHeader>
                            <div className="p-4 pb-0">
                                <Image
                                    src={selectedExercise.imagen_url}
                                    alt={selectedExercise.nombre}
                                    width={500}
                                    height={300}
                                    className="rounded"
                                />
                                <p className='text-lg font-semibold my-1'>Preparación</p>
                                <p>{selectedExercise.descripcion}</p>
                                <p className='text-lg font-semibold my-1'>Ejecución</p>
                                <TextoFormateado texto={selectedExercise.ejecucion} />
                                <p className='text-lg font-semibold my-1'>Consejos Clave</p>
                                <TextoFormateado texto={selectedExercise.consejos} />
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
        </div>
    )
}
