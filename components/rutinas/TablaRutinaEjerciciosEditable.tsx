"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ComboboxEjercicio } from "@/components/ComboboxEjercicio";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Image from "next/image";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface EjercicioDisponible {
  id: string;
  nombre: string;
  grupo_muscular: string;
  imagen_url: string;
}

interface EjercicioRutina {
  ejercicio_id: string;
  nombre: string;
  imagen_url: string;
  series: number;
  repeticiones: number;
  descanso_segundos: number;
}

interface Props {
  rutina_id: number;
}

export default function EditarRutinaEjercicios({ rutina_id }: Props) {
  const [ejercicios, setEjercicios] = useState<EjercicioRutina[]>([]);
  const [ejerciciosDisponibles, setEjerciciosDisponibles] = useState<EjercicioDisponible[]>([]);
  const [cambios, setCambios] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/rutinas/${rutina_id}/ejercicios`);
      const data = await res.json();

      const formateados: EjercicioRutina[] = data.map((ej: any) => ({
        ejercicio_id: ej.ejercicios.id,
        nombre: ej.ejercicios.nombre,
        imagen_url: ej.ejercicios.imagen_url,
        series: ej.series,
        repeticiones: ej.repeticiones,
        descanso_segundos: ej.descanso_segundos ?? 60
      }));

      setEjercicios(formateados);
      setLoading(false);
    };

    const fetchEjercicios = async () => {
      const res = await fetch("/api/ejercicios");
      const data = await res.json();
      setEjerciciosDisponibles(data);
    };

    if (rutina_id) {
      fetchData();
      fetchEjercicios();
    }
  }, [rutina_id]);

  const handleChange = (index: number, campo: keyof EjercicioRutina, valor: string | number) => {
    const updated = [...ejercicios];
    updated[index][campo] = valor as never;
    setEjercicios(updated);
    setCambios(true);
  };

  const handleAgregarEjercicio = () => {
    setEjercicios(prev => [
      ...prev,
      {
        ejercicio_id: "",
        nombre: "",
        imagen_url: "",
        series: 3,
        repeticiones: 10,
        descanso_segundos: 60
      }
    ]);
    setCambios(true);
  };

  const handleSeleccionEjercicio = (index: number, id: string) => {
    const ejercicio = ejerciciosDisponibles.find(e => e.id === id);
    if (!ejercicio) return;

    const updated = [...ejercicios];
    updated[index].ejercicio_id = ejercicio.id;
    updated[index].nombre = ejercicio.nombre;
    updated[index].imagen_url = ejercicio.imagen_url;
    setEjercicios(updated);
    setCambios(true);
  };

  const handleEliminarEjercicio = (index: number) => {
    setEjercicios(prev => prev.filter((_, i) => i !== index));
    setCambios(true);
  };

  const guardarCambios = async () => {
    const ejerciciosFormateados = ejercicios.map((ej, index) => ({
      ejercicio_id: parseInt(ej.ejercicio_id),
      series: ej.series,
      repeticiones: ej.repeticiones,
      descanso_segundos: ej.descanso_segundos,
      orden: index
    }));

    try {
      const res = await fetch("/api/rutinas/modificarrutina", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rutina_id, ejercicios: ejerciciosFormateados })
      });

      const result = await res.json();

      if (!res.ok) {
        console.error("Error al guardar cambios:", result.error);
        alert("Hubo un error al guardar la rutina.");
      } else {
        alert("Rutina actualizada correctamente.");
        setCambios(false);
      }
    } catch (err) {
      console.error("Error en la petición:", err);
      alert("Error de red o del servidor.");
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-full rounded-full" />
          <Skeleton className="h-5 w-full rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[125px] w-full rounded-xl mt-2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar rutina</CardTitle>
        <CardDescription>Agrega, elimina o edita ejercicios de esta rutina.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Imagen</TableCell>
                <TableCell>Ejercicio</TableCell>
                <TableCell>Series</TableCell>
                <TableCell>Reps</TableCell>
                <TableCell>Descanso (seg)</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ejercicios.map((ej, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {ej.imagen_url && <Image src={ej.imagen_url} alt={ej.nombre} width={60} height={60} className="rounded" />}
                  </TableCell>
                  <TableCell>
                    <ComboboxEjercicio ejercicios={ejerciciosDisponibles} value={ej.ejercicio_id} onChange={(id) => handleSeleccionEjercicio(index, id)} />
                  </TableCell>
                  <TableCell>
                    <Input type="number" min={1} value={ej.series} onChange={(e) => handleChange(index, "series", parseInt(e.target.value))} />
                  </TableCell>
                  <TableCell>
                    <Input type="number" min={1} value={ej.repeticiones} onChange={(e) => handleChange(index, "repeticiones", parseInt(e.target.value))} />
                  </TableCell>
                  <TableCell>
                    <Input type="number" min={0} value={ej.descanso_segundos} onChange={(e) => handleChange(index, "descanso_segundos", parseInt(e.target.value))} />
                  </TableCell>
                  <TableCell>
                    <Button variant="destructive" onClick={() => handleEliminarEjercicio(index)} size="sm">Eliminar</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="md:hidden space-y-6">
          {ejercicios.map((ej, index) => (
            <div key={index} className="border p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-4">
                {ej.imagen_url && <Image src={ej.imagen_url} alt={ej.nombre} width={60} height={60} className="rounded" />}
                <br className="md:hidden" />
                <div className="font-semibold truncate whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] sm:max-w-none">
                    <ComboboxEjercicio ejercicios={ejerciciosDisponibles} value={ej.ejercicio_id} onChange={(id) => handleSeleccionEjercicio(index, id)} />
                </div>
                
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Label className="pt-3 md:hidden ">Series</Label>
                <Input type="number" min={1} value={ej.series} onChange={(e) => handleChange(index, "series", parseInt(e.target.value))} placeholder="Series" />
                <Label className="pt-3 md:hidden ">Reps</Label>
                <Input type="number" min={1} value={ej.repeticiones} onChange={(e) => handleChange(index, "repeticiones", parseInt(e.target.value))} placeholder="Reps" />
                <Label className="pt-3 md:hidden ">Seg</Label>
                <Input type="number" min={0} value={ej.descanso_segundos} onChange={(e) => handleChange(index, "descanso_segundos", parseInt(e.target.value))} placeholder="Descanso (seg)" />
              </div>
              <Button variant="destructive" onClick={() => handleEliminarEjercicio(index)} size="sm" className="w-full">
                Eliminar ejercicio
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col md:flex-row gap-4">
          <Button onClick={handleAgregarEjercicio}>+ Agregar ejercicio</Button>
          {cambios && <Button onClick={guardarCambios}>Guardar cambios</Button>}
        </div>
      </CardContent>
    </Card>
  );
}
