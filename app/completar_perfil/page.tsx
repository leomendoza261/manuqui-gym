'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDownIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';


export default function CompletarPerfil() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [formulario, setFormulario] = useState({
        nombre: '',
        apellido: '',
        dni: '',
        fecha_nacimiento: '',
        telefono: '',
    });

    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [mensaje, setMensaje] = useState('');
    const [showResult, setShowResult] = useState(false)

    useEffect(() => {
        if (status === 'loading') return; // aún no sabemos si está la sesión
        if (!session) router.push('/login'); // si no hay sesión redirige
    }, [session, status, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormulario({ ...formulario, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setMensaje('');

        if (!session?.user?.email) {
            setMensaje('Sesión no válida, por favor inicia sesión nuevamente.');
            return;
        }

        if (!/^\d+$/.test(formulario.dni)) {
            setMensaje('El DNI debe contener solo números.');
            return;
        }

        if (!formulario.nombre || !formulario.apellido || !formulario.dni) {
            setMensaje('Completa todos los campos obligatorios');
            return;
        }

        // Buscar usuario existente
        const { data: usuarioExistente, error: errorBuscar } = await supabase
            .from('usuarios')
            .select('*')
            .eq('email', session.user.email)
            .single();

        if (errorBuscar && errorBuscar.code !== 'PGRST116') { // PGRST116 = No encontrado, cambia según el error real
            setMensaje('Error buscando usuario: ' + errorBuscar.message);
            return;
        }

        if (usuarioExistente) {
            setMensaje('Ya completaste tu perfil.');
            setShowResult(true)
            return;
        }

        // Insertar usuario
        const { data: insertado, error: errorInsertar } = await supabase
            .from('usuarios')
            .insert({
                email: session.user.email,
                nombre: formulario.nombre,
                apellido: formulario.apellido,
                dni: formulario.dni,
                fecha_nacimiento: formulario.fecha_nacimiento,
                telefono: formulario.telefono,
                rol: 'miembro',
            })
            .select('id')
            .single();

        if (errorInsertar || !insertado) {
            setMensaje('Error al guardar tus datos: ' + errorInsertar?.message);
            return;
        }

        // Insertar membresía
        const { error: errorMembresia } = await supabase.from('membresias').insert({
            usuario_id: insertado.id,
            tipo: 'inactiva',
            estado: 'inactiva',
            fecha_inicio: null,
            fecha_fin: null,
            pase_membresia: 3,
        });

        if (errorMembresia) {
            setMensaje('Error al crear membresía: ' + errorMembresia.message);
            return;
        }

        setMensaje('Perfil completado con éxito.');
        setShowResult(true)
    };

    const handleCloseDialog = () => {
        setShowResult(false);
        setMensaje('');
        router.push('/');
    };


    return (
        <>
            <div className="min-h-screen flex items-start justify-center p-4 bg-muted">
                <div className="w-full max-w-md bg-white rounded-xl shadow p-6 space-y-4">
                    <h2 className="text-xl font-semibold">Completá tu perfil</h2>

                    <Label>Nombre</Label>
                    <Input name="nombre" value={formulario.nombre} onChange={handleChange} />

                    <Label>Apellido</Label>
                    <Input name="apellido" value={formulario.apellido} onChange={handleChange} />

                    <Label>DNI</Label>
                    <Input name="dni" value={formulario.dni} onChange={handleChange} />

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="fecha_nacimiento">Fecha de nacimiento</Label>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="justify-between font-normal">
                                    {formulario.fecha_nacimiento || 'Selecciona una fecha'}
                                    <ChevronDownIcon className="ml-2 h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    captionLayout="dropdown"
                                    onSelect={(selectedDate) => {
                                        if (selectedDate) {
                                            setDate(selectedDate);
                                            const formatted = selectedDate.toISOString().split('T')[0];
                                            setFormulario({ ...formulario, fecha_nacimiento: formatted });
                                        }
                                        setOpen(false);
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <Label>Teléfono</Label>
                    <Input name="telefono" value={formulario.telefono} onChange={handleChange} />

                    {mensaje && <p className="text-sm text-red-500">{mensaje}</p>}

                    <Button className="w-full" onClick={handleSubmit}>
                        Guardar perfil
                    </Button>
                </div>
            </div>

            <Dialog open={showResult} onOpenChange={(open) => !open && handleCloseDialog()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Resultado</DialogTitle>
                    </DialogHeader>
                    <p>{mensaje}</p>
                    <DialogFooter>
                        <Button onClick={handleCloseDialog}>Cerrar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}