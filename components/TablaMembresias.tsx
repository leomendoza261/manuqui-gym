'use client';

import { useEffect, useState } from 'react';

type UsuarioMembresia = {
  id_usuario: number;
  nombre: string;
  apellido: string;
  dni: string;
  fecha_fin: string;
  estado: string;
};

export default function TablaMembresias() {
  const [usuarios, setUsuarios] = useState<UsuarioMembresia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembresias = async () => {
      try {
        const res = await fetch('/api/miembros');
        const data = await res.json();
        setUsuarios(data);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembresias();
  }, []);

  if (loading) return <p className="text-center mt-6">Cargando datos...</p>;

  return (
    <div className="overflow-x-auto mt-2">
      <table className="min-w-full border rounded-xl shadow-sm text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Nombre</th>
            <th className="px-4 py-2 border">Apellido</th>
            <th className="px-4 py-2 border">DNI</th>
            <th className="px-4 py-2 border">Fecha Fin</th>
            <th className="px-4 py-2 border">Estado</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id_usuario} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{usuario.nombre}</td>
              <td className="px-4 py-2 border">{usuario.apellido}</td>
              <td className="px-4 py-2 border">{usuario.dni}</td>
              <td className="px-4 py-2 border text-center">{usuario.fecha_fin}</td>
              <td className={`px-4 py-2 border text-center ${usuario.estado === 'activa' ? 'text-green-600' : 'text-red-600'}`}>
                {usuario.estado}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
