'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '../ui/skeleton';
import { Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Anuncio {
    id: number;
    imagen: string;
    titulo: string;
    informacion: string;
}

export default function TablaAnunciosDashboard() {
    const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Simulación de carga de datos
        const datosMockeados: Anuncio[] = [
            {
                id: 1,
                imagen: 'https://manuqui-gym.pedrolmendoza031297.workers.dev/boxeo.webp',
                titulo: 'Nueva clase de Boxeo',
                informacion: '¡Incorporamos boxeo todos los martes y jueves a las 20:00 hs con el profe Leo! Ideal para mejorar resistencia y quemar calorías.'
            },
            {
                id: 2,
                imagen: 'https://manuqui-gym.pedrolmendoza031297.workers.dev/nutricion.webp',
                titulo: 'Asesoría Nutricional',
                informacion: 'Todos los lunes podés reservar un turno gratuito con nuestra nutricionista. Cupos limitados. ¡Consultá en recepción!'
            },
            {
                id: 3,
                imagen: 'https://manuqui-gym.pedrolmendoza031297.workers.dev/amigos.webp',
                titulo: 'Traé a un amigo y entrená gratis',
                informacion: 'Durante agosto, si traés a un amigo nuevo, vos entrenás gratis por una semana. ¡Sumate a la promo!'
            }
        ];

        setTimeout(() => {
            setAnuncios(datosMockeados);
            setLoading(false);
        }, 10); // Simula una carga de 1 segundo
    }, []);


   /*  if (loading) return <div>
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
            {anuncios.map(anuncio => (
                <Card
                    key={anuncio.id}
                    className="p-4 cursor-pointer hover:shadow-lg transition rounded-2xl border"
                >
                    <Image
                        src={anuncio.imagen}
                        width={250}
                        height={100} alt={anuncio.titulo} />
                    <CardHeader>
                        <CardTitle>{anuncio.titulo}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{anuncio.informacion}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
