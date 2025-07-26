'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Label } from './ui/label'
import {
    Select, SelectContent, SelectItem, SelectLabel,
    SelectTrigger, SelectValue, SelectGroup
} from './ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { ChevronDownIcon } from 'lucide-react'

type Props = {
    id_membresia: number | null;
    onSuccess?: () => void;
}

export default function FormularioRenovarMembresia({ id_membresia, onSuccess }: Props) {
    const [membresiaActual, setMembresiaActual] = useState<any>(null)
    const [tipo, setTipo] = useState<'mensual' | 'trimestral' | 'semestral' | 'anual' | ''>('')
    const [fechaInicioNueva, setFechaInicioNueva] = useState<Date | null>(null)
    const [fechaFinNueva, setFechaFinNueva] = useState<Date | null>(null)

    const [openInicio, setOpenInicio] = useState(false)
    const [openFin, setOpenFin] = useState(false)

    useEffect(() => {
        const fetchMembresia = async () => {
            const res = await fetch(`/api/membresias/${id_membresia}`)
            const data = await res.json()
            setMembresiaActual(data)
            const fechaFinAnterior = new Date(data.fecha_fin)
            setFechaInicioNueva(fechaFinAnterior)
        }

        fetchMembresia()
    }, [id_membresia])

    const calcularNuevaFechaFin = (
        tipoSeleccionado: 'mensual' | 'trimestral' | 'semestral' | 'anual',
        inicio: Date
    ) => {
        const nuevaFecha = new Date(inicio)
        switch (tipoSeleccionado) {
            case 'mensual':
                nuevaFecha.setMonth(nuevaFecha.getMonth() + 1)
                break
            case 'trimestral':
                nuevaFecha.setMonth(nuevaFecha.getMonth() + 3)
                break
            case 'semestral':
                nuevaFecha.setMonth(nuevaFecha.getMonth() + 6)
                break
            case 'anual':
                nuevaFecha.setFullYear(nuevaFecha.getFullYear() + 1)
                break
        }
        return nuevaFecha
    }

    const handleTipoChange = (value: 'mensual' | 'trimestral' | 'semestral' | 'anual') => {
        setTipo(value)
        if (fechaInicioNueva) {
            const nuevaFin = calcularNuevaFechaFin(value, fechaInicioNueva)
            setFechaFinNueva(nuevaFin)
        }
    }

    const handleSubmit = async () => {
        if (!fechaInicioNueva || !fechaFinNueva || !tipo) return

        console.log(id_membresia, fechaInicioNueva, fechaFinNueva, tipo)

        const res = await fetch('/api/membresias/renovar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // ✅ importante
            },
            body: JSON.stringify({
                id_membresia,
                nuevo_inicio: fechaInicioNueva.toISOString(), // asegúrate de usar el mismo nombre que espera el API
                nuevo_fin: fechaFinNueva.toISOString(),
                tipo,
            }),
        })

        if (res.ok && typeof onSuccess === 'function') {
            alert('¡Membresía renovada con éxito!')
            onSuccess();
        } else {
            alert('Error al renovar membresía')
        }
    }

    return (
        <div className="space-y-4">
            {membresiaActual && (
                <>
                    <p>
                        <strong>Inicio anterior:</strong>{' '}
                        {format(new Date(membresiaActual.fecha_inicio), 'dd/MM/yyyy', { locale: es })}
                    </p>
                    <p>
                        <strong>Fin anterior:</strong>{' '}
                        {format(new Date(membresiaActual.fecha_fin), 'dd/MM/yyyy', { locale: es })}
                    </p>
                </>
            )}

            <div>
                <Label>Tipo de renovación</Label>
                <Select value={tipo} onValueChange={handleTipoChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Tipos membresías</SelectLabel>
                            <SelectItem value="mensual">Mensual</SelectItem>
                            <SelectItem value="trimestral">Trimestral</SelectItem>
                            <SelectItem value="semestral">Semestral</SelectItem>
                            <SelectItem value="anual">Anual</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col gap-2">
                <Label>Nueva fecha de inicio</Label>
                <Popover open={openInicio} onOpenChange={setOpenInicio}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-between font-normal">
                            {fechaInicioNueva ? format(fechaInicioNueva, 'dd/MM/yyyy') : 'Seleccionar'}
                            <ChevronDownIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={fechaInicioNueva ?? undefined}
                            captionLayout="dropdown"
                            onSelect={(fecha) => {
                                if (!fecha) return
                                setFechaInicioNueva(fecha)
                                if (tipo) {
                                    const nuevaFin = calcularNuevaFechaFin(tipo, fecha)
                                    setFechaFinNueva(nuevaFin)
                                }
                                setOpenInicio(false)
                            }}
                        />

                    </PopoverContent>
                </Popover>
            </div>

            {fechaFinNueva && (
                <div className="flex flex-col gap-2">
                    <Label>Nueva fecha de fin</Label>
                    <Popover open={openFin} onOpenChange={setOpenFin}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="justify-between font-normal">
                                {fechaFinNueva ? format(fechaFinNueva, 'dd/MM/yyyy') : 'Seleccionar'}
                                <ChevronDownIcon className="ml-2 h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 ">
                            <Calendar
                                mode="single"
                                selected={fechaFinNueva ?? undefined}
                                captionLayout="dropdown"
                                onSelect={(fecha) => {
                                    if (!fecha) return
                                    setFechaFinNueva(fecha)
                                    setOpenFin(false)
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            )}

            <Button onClick={handleSubmit} disabled={!fechaFinNueva}>
                Renovar membresía
            </Button>
        </div>
    )
}
