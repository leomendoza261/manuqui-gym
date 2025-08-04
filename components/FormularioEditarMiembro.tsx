'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'

type Miembro = {
    id: string
    nombre: string
    apellido: string
    dni: string
    email: string
    telefono: string
    fecha_nacimiento: string 
    tipo_sangre_id: number | null
    rol: string
}

type Props = {
    id_usuario: string | null
    OnSuccess: () => void
}

export default function FormularioEditarMiembro({ id_usuario, OnSuccess: onSuccess }: Props) {
    const [openFecha, setOpenFecha] = useState(false)
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState<Miembro>({
        id: '',
        nombre: '',
        apellido: '',
        dni: '',
        email: '',
        telefono: '',
        fecha_nacimiento: '',
        tipo_sangre_id: null,
        rol: '',
    })

    const [isFetching, setIsFetching] = useState(true)

    useEffect(() => {
        if (!id_usuario) return

        const fetchData = async () => {
            setIsFetching(true)
            const res = await fetch(`/api/miembros/${id_usuario}`)
            const data = await res.json()
            setForm(data)
            setIsFetching(false)
        }

        fetchData()
    }, [id_usuario])


    const handleChange = (campo: keyof Miembro, valor: any) => {
        setForm((prev) => ({ ...prev, [campo]: valor }))
    }

    const handleSubmit = async () => {
        setLoading(true)

        const datosFiltrados = {
            id: form.id,
            email: form.email,
            nombre: form.nombre,
            apellido: form.apellido,
            dni: form.dni,
            fecha_nacimiento: form.fecha_nacimiento,
            tipo_sangre_id: form.tipo_sangre_id,
            telefono: form.telefono,
            rol: form.rol,
        };

        console.log("lo que envio", datosFiltrados)

        const res = await fetch(`/api/miembros/miembro/editar/${id_usuario}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosFiltrados),
        })

        setLoading(false)

        if (res.ok) {
            alert('Miembro actualizado correctamente')
            onSuccess?.()
        } else {
            alert('Error al actualizar')
        }
    }

    return isFetching ? (

        <div className="flex justify-center items-center h-60">
            <span className="text-gray-500">Cargando datos del miembro...</span>
        </div>
    ) : (

        <div className="space-y-4 p-4">
            <div >
                <Label>Nombre</Label>
                <Input value={form.nombre} onChange={(e) => handleChange('nombre', e.target.value)} />
                <Label>Apellido</Label>
                <Input value={form.apellido} onChange={(e) => handleChange('apellido', e.target.value)} />
                <Label>DNI</Label>
                <Input value={form.dni} onChange={(e) => handleChange('dni', e.target.value)} />
                <Label>Email</Label>
                <Input value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
                <Label>Teléfono</Label>
                <Input value={form.telefono} onChange={(e) => handleChange('telefono', e.target.value)} />

                <div className="flex flex-col gap-3">
                    <Label>Fecha de nacimiento</Label>

                    <Input type='date' value={form.fecha_nacimiento} onChange={(e) => handleChange('fecha_nacimiento', e.target.value)}/>

                    {/* <Popover open={openFecha} onOpenChange={setOpenFecha}>
                        <PopoverTrigger asChild>
                            <Button variant="outline">
                                {form.fecha_nacimiento
                                    ? format(new Date(form.fecha_nacimiento), 'PPP', { locale: es })
                                    : 'Seleccionar fecha'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={form.fecha_nacimiento ? new Date(form.fecha_nacimiento) : undefined}
                                onSelect={(fecha) => {
                                    if (fecha) {
                                        handleChange('fecha_nacimiento', fecha)
                                        setOpenFecha(false)
                                    }
                                }}
                            />
                        </PopoverContent>
                    </Popover> */}
                </div>

                <Label>Tipo de sangre</Label>
                <Select
                    value={form.tipo_sangre_id?.toString() || ''}
                    onValueChange={(val) => handleChange('tipo_sangre_id', parseInt(val))}
                >
                    <SelectTrigger className="">
                        <SelectValue placeholder="Selecciona un tipo de sangre" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Tipo de sangre</SelectLabel>
                            <SelectItem value="1">A+</SelectItem>
                            <SelectItem value="2">A-</SelectItem>
                            <SelectItem value="3">B+</SelectItem>
                            <SelectItem value="4">B-</SelectItem>
                            <SelectItem value="5">AB+</SelectItem>
                            <SelectItem value="6">AB-</SelectItem>
                            <SelectItem value="7">O+</SelectItem>
                            <SelectItem value="8">O-</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>



                <Label>Rol</Label>
                <Select
                    value={form.rol}
                    onValueChange={(value) =>
                        handleChange('rol', value as 'miembro' | 'entrenador' | 'administrador')
                    }
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="miembro">Miembro</SelectItem>
                        <SelectItem value="entrenador">Entrenador</SelectItem>
                        <SelectItem value="administrador">Administrador</SelectItem>
                    </SelectContent>
                </Select>


            </div>

            <div className="flex justify-end">
                <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar cambios'}
                </Button>
            </div>
        </div>
    )
}
