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
import { Input } from './ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'

type Props = {
    id_membresia: number | null;
    onSuccess?: () => void;
}

export default function FormularioRenovarMembresia({ id_membresia, onSuccess }: Props) {
    const [membresiaActual, setMembresiaActual] = useState<any>(null)
    const [tipo, setTipo] = useState<'mensual' | 'trimestral' | 'semestral' | 'anual' | ''>('')

    const [fechaInicioNueva, setFechaInicioNueva] = useState<string>(''); // <-- string
    const [fechaFinNueva, setFechaFinNueva] = useState<string>('');       // <-- string

    const [paseMembresia, setPaseMembresia] = useState<number | null>(null)


    const [showConfirm, setShowConfirm] = useState(false)
    const [showResult, setShowResult] = useState(false)
    const [mensaje, setMensaje] = useState("")

    useEffect(() => {
        const fetchMembresia = async () => {
            const res = await fetch(`/api/membresias/${id_membresia}`);
            const data = await res.json();
            setMembresiaActual(data);

            // Asumiendo que `data.fecha_fin` viene como "YYYY-MM-DD" desde el backend
            setFechaInicioNueva(data.fecha_fin || '');
            setPaseMembresia(data.pase_membresia ?? null);
        };

        if (id_membresia) {
            fetchMembresia();
        }
    }, [id_membresia]);

    const calcularNuevaFechaFin = (
        tipoSeleccionado: 'mensual' | 'trimestral' | 'semestral' | 'anual',
        inicio: string // formato yyyy-MM-dd
    ) => {
        const [year, month, day] = inicio.split('-').map(Number);
        const nuevaFecha = new Date(year, month - 1, day);

        switch (tipoSeleccionado) {
            case 'mensual':
                nuevaFecha.setMonth(nuevaFecha.getMonth() + 1);
                break;
            case 'trimestral':
                nuevaFecha.setMonth(nuevaFecha.getMonth() + 3);
                break;
            case 'semestral':
                nuevaFecha.setMonth(nuevaFecha.getMonth() + 6);
                break;
            case 'anual':
                nuevaFecha.setFullYear(nuevaFecha.getFullYear() + 1);
                break;
        }

        // Formateamos de nuevo a yyyy-MM-dd sin zona horaria
        const y = nuevaFecha.getFullYear();
        const m = String(nuevaFecha.getMonth() + 1).padStart(2, '0');
        const d = String(nuevaFecha.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };


    const handleTipoChange = (value: 'mensual' | 'trimestral' | 'semestral' | 'anual') => {
        setTipo(value)
        if (fechaInicioNueva) {
            const nuevaFin = calcularNuevaFechaFin(value, fechaInicioNueva)
            setFechaFinNueva(nuevaFin)
        }
    }

    // Abrir modal al querer renovar
    const handleOpenConfirm = () => {
        if (!fechaInicioNueva || !fechaFinNueva || !tipo) {
            setMensaje("⚠️ Completa todos los campos antes de continuar");
            setShowResult(true);
            return;
        }
        setShowConfirm(true);
    };

    // Confirmar desde modal
    const handleConfirmSubmit = async () => {
        setShowConfirm(false);
        await handleSubmit();
    };



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
                nuevo_inicio: fechaInicioNueva, // asegúrate de usar el mismo nombre que espera el API
                nuevo_fin: fechaFinNueva,
                tipo,
                pase_membresia: paseMembresia,
            }),
        })

        if (res.ok && typeof onSuccess === 'function') {

            setMensaje("✅ ¡Membresía renovada con éxito!");
            /* alert('¡Membresía renovada con éxito!') */
            onSuccess();
        } else {
            /* alert('Error al renovar membresía') */
            setMensaje("❌ Hubó un error al renovar la membresía")
        }

        setShowResult(true)
    }

    return (
        <>
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
                                <SelectLabel>Tipos de membresías</SelectLabel>
                                <SelectItem value="mensual">Mensual</SelectItem>
                                <SelectItem value="trimestral">Trimestral</SelectItem>
                                <SelectItem value="semestral">Semestral</SelectItem>
                                <SelectItem value="anual">Anual</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Label>Pase de membresia</Label>
                    <Select value={paseMembresia?.toString() ?? ''} onValueChange={(val) => setPaseMembresia(Number(val))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Tipos de pases</SelectLabel>
                                <SelectItem value="1">3 dias</SelectItem>
                                <SelectItem value="2">7 dias</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Nueva fecha de inicio</Label>
                    <Input
                        type="date"
                        value={fechaInicioNueva}
                        onChange={(e) => {
                            const value = e.target.value;
                            setFechaInicioNueva(value);

                            if (tipo && value) {
                                const nuevaFin = calcularNuevaFechaFin(tipo, value);
                                setFechaFinNueva(nuevaFin);
                            } else {
                                setFechaFinNueva('');
                            }
                        }}
                    />
                </div>

                {fechaFinNueva && (
                    <div className="flex flex-col gap-2">
                        <Label>Nueva fecha de fin</Label>
                        <Input
                            type="date"
                            value={fechaFinNueva}
                            onChange={(e) => setFechaFinNueva(e.target.value)}
                        />
                    </div>
                )}

                <Button onClick={handleOpenConfirm} disabled={!fechaFinNueva}>
                    Renovar membresía
                </Button>

            </div>


            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar renovación de membresía</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que deseas renovar la membresía de este miembro?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancelar</Button>
                        <Button onClick={handleConfirmSubmit}>Confirmar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            <Dialog open={showResult} onOpenChange={setShowResult}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Resultado</DialogTitle>
                    </DialogHeader>
                    <p>{mensaje}</p>
                    <DialogFooter>
                        <Button onClick={() => setShowResult(false)}>Cerrar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


        </>
    )
}
