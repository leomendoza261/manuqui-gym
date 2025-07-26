'use client';

import { useEffect, useState } from 'react';

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

    if (loading) return <p>Cargando...</p>;
    if (!usuario) return <p>No se pudo cargar la información del usuario.</p>;

    return (
        <div>
            {usuario.nombre && <p><strong>Nombre:</strong> {usuario.nombre}</p>}
            {usuario.apellido && <p><strong>Apellido:</strong> {usuario.apellido}</p>}
            <p><strong>DNI:</strong> {usuario.dni}</p>
            <p><strong>Fecha de nacimiento:</strong> {usuario.fecha_nacimiento}</p>
            <p><strong>Tipo de sangre:</strong> {usuario.tipo_sangre}</p>
            <p><strong>Email:</strong> {usuario.email}</p>
            <p><strong>Telefono:</strong> {usuario.telefono}</p>
            <p><strong>Rol:</strong> {usuario.rol}</p>
            <br />
            <p><strong>Estado de membresía:</strong> {usuario.membresia.estado}</p>
            <p><strong>Fecha de inicio:</strong> {usuario.membresia.fecha_inicio}</p>
            <p><strong>Fecha de vencimiento:</strong> {usuario.membresia.fecha_fin}</p>
        </div>
    );
}
