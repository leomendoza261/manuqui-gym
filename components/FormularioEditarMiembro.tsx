'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"

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
    onSuccess?: () => void;
}

export default function FormularioEditarMiembro({ id_usuario, onSuccess }: Props) {
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
    const [modalConfirmar, setModalConfirmar] = useState(false)
    const [modalResultado, setModalResultado] = useState<{ tipo: 'exito' | 'error', mensaje: string } | null>(null)

    useEffect(() => {
        if (!id_usuario) return
        const fetchData = async () => {
            setIsFetching(true)
            const res = await fetch(`/api/miembros/${id_usuario}`)
            const data = await res.json()
            setForm({
                ...data,
                fecha_nacimiento: data.fecha_nacimiento
                    ? data.fecha_nacimiento.split('T')[0] // 🔹 Aseguramos formato YYYY-MM-DD
                    : ''
            })
            setIsFetching(false)
        }
        fetchData()
    }, [id_usuario])

    const handleChange = (campo: keyof Miembro, valor: any) => {
        setForm(prev => ({ ...prev, [campo]: valor }))
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
        }

        const res = await fetch(`/api/miembros/miembro/editar/${id_usuario}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosFiltrados),
        })

        setLoading(false)

        if (res.ok) {
            setModalResultado({ tipo: 'exito', mensaje: 'Miembro actualizado correctamente' })
            onSuccess?.()
        } else {
            setModalResultado({ tipo: 'error', mensaje: 'Error al actualizar el miembro' })
        }
    }

    if (isFetching) {
        return (
            <div className="flex justify-center items-center h-60">
                <span className="text-gray-500">Cargando datos del miembro...</span>
            </div>
        )
    }

    return (
        <>
            <div className="space-y-4 p-4">
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
                    <Input
                        type='date'
                        value={form.fecha_nacimiento}
                        onChange={(e) => handleChange('fecha_nacimiento', e.target.value)}
                    />
                </div>

                <Label>Tipo de sangre</Label>
                <Select
                    value={form.tipo_sangre_id?.toString() || ''}
                    onValueChange={(val) => handleChange('tipo_sangre_id', parseInt(val))}
                >
                    <SelectTrigger>
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

                <div className="flex justify-end">
                    <Button onClick={() => setModalConfirmar(true)} disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar cambios'}
                    </Button>
                </div>
            </div>

            {/* Modal de confirmación */}
            <Dialog open={modalConfirmar} onOpenChange={setModalConfirmar}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar cambios</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que quieres guardar los cambios?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setModalConfirmar(false)}>Cancelar</Button>
                        <Button onClick={() => { setModalConfirmar(false); handleSubmit(); }}>
                            Confirmar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal de resultado */}
            {modalResultado && (
                <Dialog open={true} onOpenChange={() => setModalResultado(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {modalResultado.tipo === 'exito' ? '✅ Éxito' : '❌ Error'}
                            </DialogTitle>
                            <DialogDescription>{modalResultado.mensaje}</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button onClick={() => setModalResultado(null)}>Cerrar</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}
