'use client';

import { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from './ui/skeleton';

type Usuario = {
    id: string;
    email: string;
    rol: string;
    nombre?: string;
    apellido?: string;
    dni: string;
    fecha_nacimiento: string;
    tipo_sangre: string;
    telefono: string;
    membresia: {
        estado: string;
        fecha_inicio: string;
        fecha_fin: string;
    };
};

type Props = {
    id_usuario?: string | null;
};

export default function PerfilUsuario({ id_usuario }: Props) {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const obtenerUsuario = async () => {
            try {
                const ruta = id_usuario
                    ? `/api/miembros/${id_usuario}`
                    : `/api/miembros/miembro`;

                const res = await fetch(ruta);
                if (!res.ok) throw new Error('Error al cargar usuario');
                const data = await res.json();
                setUsuario(data);
            } catch (err) {
                console.error(err);
                setUsuario(null);
            } finally {
                setLoading(false);
            }
        };

        obtenerUsuario();
    }, [id_usuario]);

    if (loading) return(
    <div>
        <Skeleton className="h-[200px] w-full rounded-xl mt-2" />
        <Skeleton className="h-[150px] w-full rounded-xl mt-2" />
    </div>);
    if (!usuario) return <p>No se pudo cargar la información del usuario.</p>;

    return (
        <div>

            {/* <Table>
                <TableCaption></TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Invoice</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">Nombre</TableCell>
                        <TableCell>{usuario.nombre}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">Apellido</TableCell>
                        <TableCell>{usuario.apellido}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">DNi</TableCell>
                        <TableCell>{usuario.dni}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">Fecha de nacimiento</TableCell>
                        <TableCell>{usuario.fecha_nacimiento}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">Tipo de sangre</TableCell>
                        <TableCell>{usuario.tipo_sangre}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">Email</TableCell>
                        <TableCell>{usuario.email}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">Telefono</TableCell>
                        <TableCell>{usuario.telefono}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">Rol</TableCell>
                        <TableCell>{usuario.rol}</TableCell>
                    </TableRow>
                </TableBody>
            </Table> */}

            {usuario.nombre && <p><strong>Nombre:</strong> {usuario.nombre}</p>}
            {usuario.apellido && <p><strong>Apellido:</strong> {usuario.apellido}</p>}
            <p><strong>DNI:</strong> {usuario.dni}</p>
            <p><strong>Fecha de nacimiento:</strong> {usuario.fecha_nacimiento}</p>
            <p><strong>Tipo de sangre:</strong> {usuario.tipo_sangre}</p>
            <p><strong>Email:</strong> {usuario.email}</p>
            <p><strong>Telefono:</strong> {usuario.telefono}</p>
            <p><strong>Rol:</strong> {usuario.rol}</p>
            <br />
            <p className='text-center'><strong>Estado de membresía</strong> </p>
            <p className='text-center'><span className='text-xl text-center font-bold text-green-500'>{usuario.membresia.estado}</span></p>
            <p className='text-center'><strong>Fecha de inicio</strong></p>
            <p className='text-center'><span className='text-xl text-center font-bold'>{usuario.membresia.fecha_inicio}</span></p>
            <p className='text-center'><strong>Fecha de vencimiento</strong> </p>
            <p className='text-center'><span className='text-xl text-center font-bold'>{usuario.membresia.fecha_fin}</span></p>
        </div>
    );
}
