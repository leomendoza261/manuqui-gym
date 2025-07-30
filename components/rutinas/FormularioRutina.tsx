'use client'

import { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { ComboboxUsuarios } from '../ComboboxUsuarios'
import { ComboboxEjercicio } from '../ComboboxEjercicio'



type Usuario = {
    id: string
    nombre: string
    apellido: string
    rol: string
}

type Ejercicio = {
    id: string
    nombre: string
    grupo_muscular: string
    imagen_url: string
}

type EjercicioRutina = {
    ejercicio_id: string
    series: string
    repeticiones: string
}

export default function FormularioRutina() {
    const [nombreRutina, setNombreRutina] = useState('')
    const [entrenadores, setEntrenadores] = useState<Usuario[]>([])
    const [miembros, setMiembros] = useState<Usuario[]>([])
    const [ejerciciosDisponibles, setEjerciciosDisponibles] = useState<Ejercicio[]>([])
    const [creadorId, setCreadorId] = useState('')
    const [miembroId, setMiembroId] = useState('')
    const [ejercicios, setEjercicios] = useState<EjercicioRutina[]>([])

    useEffect(() => {
        const fetchDatos = async () => {
            const entrenadoresRes = await fetch('/api/miembros/rol?rol=entrenador,administrador')
            const entrenadoresData = await entrenadoresRes.json()
            setEntrenadores(entrenadoresData)

            const miembrosRes = await fetch('/api/miembros/rol?rol=entrenador,miembro,administrador')
            const miembrosData = await miembrosRes.json()
            setMiembros(miembrosData)

            const ejerciciosRes = await fetch('/api/ejercicios')
            const ejerciciosData = await ejerciciosRes.json()
            setEjerciciosDisponibles(ejerciciosData)
        }

        fetchDatos()
    }, [])

    const handleAgregarEjercicio = () => {
        setEjercicios([...ejercicios, { ejercicio_id: '', series: '', repeticiones: '' }])
    }

    const handleChangeEjercicio = (index: number, field: keyof EjercicioRutina, value: string) => {
        const updated = [...ejercicios]
        updated[index][field] = value
        setEjercicios(updated)
    }

    const handleEliminarEjercicio = (index: number) => {
        setEjercicios(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const rutina = {
            nombre: nombreRutina,
            creador_id: creadorId,
            miembro_id: miembroId,
            ejercicios,
        }
        console.log(rutina)

        const res = await fetch('/api/rutinas/agregarrutina', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rutina),
        })

        if (res.ok) {
            alert('Rutina creada correctamente')
            // Resetear formulario
            setNombreRutina('')
            setCreadorId('')
            setMiembroId('')
            setEjercicios([])
        } else {
            alert('Error al crear la rutina')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 max-w-xl mx-auto p-4">
            <div>
                <Label>Nombre de la rutina</Label>
                <Input
                    placeholder="Ej. Rutina pecho/lunes"
                    value={nombreRutina}
                    onChange={(e) => setNombreRutina(e.target.value)}
                />
            </div>

            <div>
                <Label>Seleccionar creador (entrenador/admin)</Label>
                <ComboboxUsuarios
                    users={entrenadores}
                    value={creadorId}
                    onChange={setCreadorId}
                />
            </div>

            <div>
                <Label>Seleccionar miembro</Label>
                <ComboboxUsuarios
                    users={miembros}
                    value={miembroId}
                    onChange={setMiembroId}
                />
            </div>

            <div className="space-y-4">
                <Label>Ejercicios</Label><br />
                {ejercicios.map((ej, index) => (
                    <div key={index} className="border rounded-md p-2 space-y-2">
                        <div>
                            <ComboboxEjercicio
                                ejercicios={ejerciciosDisponibles}
                                value={ej.ejercicio_id}
                                onChange={(id) => handleChangeEjercicio(index, 'ejercicio_id', id)}
                            />

                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Label>Series</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={ej.series}
                                    onChange={(e) => handleChangeEjercicio(index, 'series', e.target.value)}
                                />
                            </div>
                            <div className="flex-1">
                                <Label>Repeticiones</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={ej.repeticiones}
                                    onChange={(e) => handleChangeEjercicio(index, 'repeticiones', e.target.value)}
                                />
                            </div>
                        </div>

                        <Button type="button" variant="destructive" onClick={() => handleEliminarEjercicio(index)}>
                            Eliminar ejercicio
                        </Button>
                    </div>
                ))}

                <Button type="button" onClick={handleAgregarEjercicio}>
                    + Agregar ejercicio
                </Button>
            </div>

            <Button type="submit" className="w-full mt-4">
                Guardar rutina
            </Button>
        </form>
    )
}
