'use client';
import * as React from "react"
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";


export default function RegisterPage() {
  const [formulario, setFormulario] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    fecha_nacimiento: '',
    telefono: ''
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setErrorMsg('');

    // Validar DNI
    if (!/^\d+$/.test(formulario.dni)) {
      setErrorMsg('El DNI debe contener solo números.');
      return;
    }

    // Validar Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Por favor ingresá un correo electrónico válido.');
      return;
    }

    // Validar contraseña mínima
    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    // 1. Registrar en Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error || !data.user) {
      setErrorMsg(error?.message || 'Error al registrar');
      return;
    }

    // 2. Insertar en tabla `usuarios` y recuperar el id
    const { data: usuarioInsertado, error: dbError } = await supabase
      .from('usuarios')
      .insert({
        email,
        nombre: formulario.nombre,
        apellido: formulario.apellido,
        dni: formulario.dni,
        fecha_nacimiento: formulario.fecha_nacimiento,
        telefono: formulario.telefono,
        rol: 'miembro',
      })
      .select('id')
      .single();

    if (dbError || !usuarioInsertado) {
      setErrorMsg('Registrado en auth, pero error al crear en usuarios: ' + dbError?.message);
      return;
    }

    // 3. Insertar membresía con el id del usuario
    const { error: membresiaError } = await supabase.from('membresias').insert({
      usuario_id: usuarioInsertado.id,
      tipo: 'inactiva',
      estado: 'inactiva',
      pase_membresia: 3,
      fecha_inicio: null,
      fecha_fin: null
    });

    if (membresiaError) {
      setErrorMsg('Usuario creado pero error al asignar membresía: ' + membresiaError.message);
      return;
    }

    alert('Registro exitoso. Ahora podés iniciar sesión.');
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-start justify-center p-4 bg-muted">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Crear cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>Nombre</Label>
          <Input
            name="nombre"
            type="text"
            placeholder="Nombre"
            className="mb-2"
            value={formulario.nombre}
            onChange={handleChange}
            required
          />
          <Label>Apellido</Label>
          <Input
            name="apellido"
            type="text"
            placeholder="Apellido"
            className="mb-2"
            value={formulario.apellido}
            onChange={handleChange}
            required
          />
          <Label>DNI</Label>
          <Input
            name="dni"
            type="text"
            placeholder="12345678"
            className="mb-2"
            value={formulario.dni}
            onChange={handleChange}
            required
          />

          <div className="flex flex-col gap-2 mb-2">
            <Label htmlFor="fecha_nacimiento">Fecha de nacimiento</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="fecha_nacimiento"
                  className="justify-between font-normal"
                >
                  {formulario.fecha_nacimiento ? formulario.fecha_nacimiento : "Selecciona una fecha"}
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
          <Input
            name="telefono"
            type="text"
            placeholder="12345678"
            className="mb-2"
            value={formulario.telefono}
            onChange={handleChange}
            required
          />

          <Label>Correo electrónico</Label>
          <Input
            type="email"
            placeholder="Correo electrónico"
            className="mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Label>Contraseña</Label>
          <Input
            type="password"
            placeholder="Contraseña"
            className="mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
          <Button className="w-full mt-4" onClick={handleRegister}>
            Registrarse
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
