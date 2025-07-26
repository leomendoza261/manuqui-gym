'use client';

import { InfoIcon, Pencil, RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';

import ModalMembresia from './ModalMembresia';
import ModalInformacion from './ModalInfoMiembro';
import ModalEditar from './ModalEditar';
import { Input } from './ui/input';

type UsuarioMembresia = {
  id: number;
  id_usuario: string;
  nombre: string;
  apellido: string;
  dni: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
};

export default function TablaMembresias() {
  const [usuarios, setUsuarios] = useState<UsuarioMembresia[]>([]);
  const [loading, setLoading] = useState(true);


  const [modalInformacion, setModalInformacion] = useState(false)
  const [modalMembresia, setModalMembresia] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);


  const [idUsuarioSeleccionado, setIdUsuarioSeleccionado] = useState<string | null>(null);
  const [idMembresiaSeleccionada, setIdMembresiaSeleccionada] = useState<number | null>(null);

  const [filtroDNI, setFiltroDNI] = useState('');

  const abrirModalEditar = (id: string) => {
    setIdUsuarioSeleccionado(id)
    setModalEditar(true)
  }

  const abrirModalInformacion = (id: string) => {
    setIdUsuarioSeleccionado(id)
    setModalInformacion(true)
  }

  const abrirModalMembresia = (id: number) => {
    setIdMembresiaSeleccionada(id);
    setModalMembresia(true);
  };


  const refetchData = async () => {
    const res = await fetch("/api/miembros");
    const json: UsuarioMembresia[] = await res.json();
    setUsuarios(json);
  };

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

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.dni.toLowerCase().includes(filtroDNI.toLowerCase())
  );

  if (loading) return <p className="text-center mt-6">Cargando datos...</p>;

  return (
    <div className="overflow-x-auto mt-2">

      <div className="mb-4 flex justify-start">
        <Input
          type="text"
          placeholder="Buscar por DNI"
          className="border border-input rounded-md mx-2 my-2 w-64"
          value={filtroDNI}
          onChange={(e) => setFiltroDNI(e.target.value)}
        />
      </div>


      <table className="min-w-full border rounded-xl shadow-sm text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Nombre</th>
            <th className="px-4 py-2 border">Apellido</th>
            <th className="px-4 py-2 border">DNI</th>
            <th className="px-4 py-2 border">Fecha Inicio</th>
            <th className="px-4 py-2 border">Fecha Vencimiento</th>
            <th className="px-4 py-2 border">Estado</th>
            <th className="px-4 py-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.map((usuario) => (
            <tr key={usuario.id_usuario} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{usuario.nombre}</td>
              <td className="px-4 py-2 border">{usuario.apellido}</td>
              <td className="px-4 py-2 border">{usuario.dni}</td>
              <td className="px-4 py-2 border text-center">{usuario.fecha_inicio}</td>
              <td className="px-4 py-2 border text-center">{usuario.fecha_fin}</td>
              <td className={`px-4 py-2 border text-center ${usuario.estado === 'activa' ? 'text-green-600' : 'text-red-600'}`}>
                {usuario.estado}
              </td>
              <td className="px-4 py-2 border space-x-4 text-center">
                <button className="text-blue-500 " onClick={() => abrirModalMembresia(usuario.id)}><RefreshCcw className="h-3.5 w-3.5" /></button>
                <button className="text-blue-500 " onClick={() => abrirModalInformacion(usuario.id_usuario)}><InfoIcon className="h-3.5 w-3.5" /></button>
                <button className="text-blue-500 " onClick={() => abrirModalEditar(usuario.id_usuario)}><Pencil className="h-3.5 w-3.5" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalMembresia
        open={modalMembresia}
        onClose={() => setModalMembresia(false)}
        idMembresia={idMembresiaSeleccionada}
        onSuccess={() => {
          setModalMembresia(false);
          refetchData();
        }}
      />

      <ModalInformacion
        open={modalInformacion}
        onClose={() => setModalInformacion(false)}
        id_usuario={idUsuarioSeleccionado}
        onSuccess={() => {
          setModalInformacion(false);
        }}
      />

      <ModalEditar
        open={modalEditar}
        onClose={() => setModalEditar(false)}
        id_usuario={idUsuarioSeleccionado}
        onSuccess={() => {
          setModalEditar(false);
          refetchData();
        }}
      />

    </div>
  );
}


