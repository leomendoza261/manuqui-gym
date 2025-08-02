'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '../ui/skeleton';
import { Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Entrenador {
    id: number;
    nombre: string;
    apellido: string;
    telefono: string;
    imagen: string;
}

export default function TablaEntrenadoresDashboard() {
    const [entrenadores, setEntrenadores] = useState<Entrenador[]>([]);
    const [loading, setLoading] = useState(true)

    /* useEffect(() => {
        fetch('/api/entrenadores')
            .then(res => res.json())
            .then(data => setEntrenadores(data))
            .catch(err => console.error(err));
        setLoading(false)
    }, []); */

    useEffect(() => {
            // Simulación de carga de datos
            const datosMockeados: Entrenador[] = [
                {
                    id: 1,
                    imagen: 'https://manuqui-gym.pedrolmendoza031297.workers.dev/julia-rekamie.webp',
                    nombre: "Julia",
                    apellido: "Rekamie",
                    telefono: "12345678"
                },
                {
                    id: 2,
                    imagen: 'https://manuqui-gym.pedrolmendoza031297.workers.dev/daniel-lincoln.webp',
                    nombre: "Daniel",
                    apellido: "Lincoln",
                    telefono: "12345679"
                },

            ];
    
            setTimeout(() => {
                setEntrenadores(datosMockeados);
                setLoading(false);
            }, 10); // Simula una carga de 1 segundo
        }, []);


    /* if (loading) return <div>
        <Card>
            <CardHeader>
                <CardTitle><Skeleton className="h-6 w-full rounded-full" /></CardTitle>
                <CardDescription><Skeleton className="h-5 w-full rounded-full" /></CardDescription>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[125px] w-full rounded-xl" />
            </CardContent>
        </Card>
    </div> */

    return (
        <div className="p-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {entrenadores.map(rutina => (
                <Card
                    key={rutina.id}
                    className="p-4 cursor-pointer hover:shadow-lg transition rounded-2xl border"
                >
                    <Image src={rutina.imagen}
                        alt={rutina.nombre}
                        width={250}
                        height={100} />
                    <CardHeader>
                        <CardTitle>{rutina.nombre} {rutina.apellido}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Link href={`https://wa.me/${rutina.telefono.replace(/\D/g, '')}`} 
                        className="flex items-center space-x-2 text-green-600 hover:underline">
                            <Phone className='h-4 w-4' /><span>{rutina.telefono}</span>
                        </Link>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
