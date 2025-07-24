'use client';

import { useState } from 'react';
import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Button } from './ui/button';
import { Calendar } from "./ui/calendar"
import { Label } from "./ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "./ui/dialog"

export default function FormularioMiembro() {
  const [formulario, setFormulario] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    fecha_nacimiento: '',
    telefono: '',
    tipo_sangre_id: '',
    rol: '',
    tipo_membresia: '',
    fecha_inicio: '',
    fecha_fin: '',

  });
  const [open, setOpen] = React.useState(false)
  const [openInicio, setOpenInicio] = useState(false);
  const [openFin, setOpenFin] = useState(false);

  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [dateInicio, setDateInicio] = useState<Date | undefined>(undefined);
  const [dateFin, setDateFin] = useState<Date | undefined>(undefined);

  const [showConfirm, setShowConfirm] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [mensaje, setMensaje] = useState("")


  const handleChange = (e: any) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validarCampos = () => {
      const camposObligatorios = [
        "nombre",
        "apellido",
        "dni",
        "email",
        "telefono",
        "fecha_nacimiento",
        "tipo_sangre_id",
        "rol",
        "tipo_membresia",
        "fecha_inicio",
        "fecha_fin"
      ];

      for (const campo of camposObligatorios) {
        if (!formulario[campo as keyof typeof formulario]) {
          return false;
        }
      }

      return true;
    };


    if (!validarCampos()) {
      setMensaje("❌ Por favor, completa todos los campos requeridos.");
      setShowResult(true);
      return;
    }

    setShowConfirm(true);
  };

  const enviarFormulario = async () => {
    setShowConfirm(false);

    console.log(formulario)

    const res = await fetch('/api/miembros/agregar_miembro', {
      method: 'POST',
      body: JSON.stringify({
        ...formulario,
        tipo_sangre_id: parseInt(formulario.tipo_sangre_id),
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    if (res.ok) {
      setMensaje("✅ Miembro registrado correctamente.");
    } else {
      setMensaje("❌ Error: " + JSON.stringify(data.error));
    }

    setShowResult(true);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 max-w-xl mx-auto p-4">
        <Input name="nombre" placeholder="Nombre" value={formulario.nombre} onChange={handleChange} required />
        <Input name="apellido" placeholder="Apellido" value={formulario.apellido} onChange={handleChange} required className=" p-2" />
        <Input name="dni" placeholder="DNI" value={formulario.dni} onChange={handleChange} required className=" p-2" />
        <Input name="email" placeholder="Email" value={formulario.email} onChange={handleChange} required className=" p-2" />
        <Input name="telefono" placeholder="Teléfono" value={formulario.telefono} onChange={handleChange} required className="p-2" />


        {/* <Input type="date" name="fecha_nacimiento" value={formulario.fecha_nacimiento} onChange={handleChange} required className="p-2" /> */}

        <div className="flex flex-col gap-2">
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
                    const formatted = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
                    setFormulario({ ...formulario, fecha_nacimiento: formatted });
                  }
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <Select name="tipo_sangre_id" value={formulario.tipo_sangre_id} onValueChange={(value) => setFormulario({ ...formulario, tipo_sangre_id: value })} required>
          <SelectTrigger >
            <SelectValue placeholder="Selecciona un tipo de sangre" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Tipos de sangre</SelectLabel>
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


        <Select name="rol" value={formulario.rol} onValueChange={(value) => setFormulario({ ...formulario, rol: value })} required>
          <SelectTrigger >
            <SelectValue placeholder="Selecciona un rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Roles</SelectLabel>
              <SelectItem value="miembro">Miembro</SelectItem>
              <SelectItem value="entrenador">Entrenador</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Label htmlFor="Membresia">Membresia</Label>
        <Select name="tipo_membresia" value={formulario.tipo_membresia} onValueChange={(value) => setFormulario({ ...formulario, tipo_membresia: value })} required>
          <SelectTrigger >
            <SelectValue placeholder="Selecciona una membresia" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Membresias</SelectLabel>
              <SelectItem value="diaria">Diaria</SelectItem>
              <SelectItem value="mensual">Mensual</SelectItem>
              <SelectItem value="trimestral">Trimestral</SelectItem>
              <SelectItem value="semestral">Semestral</SelectItem>
              <SelectItem value="anual">Anual</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="flex flex-col gap-2">
          <Label htmlFor="fecha_inicio">Fecha de inicio de membresia</Label>
          <Popover open={openInicio} onOpenChange={setOpenInicio}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="fecha_inicio"
                className="justify-between font-normal"
              >
                {formulario.fecha_inicio ? formulario.fecha_inicio : "Selecciona una fecha"}
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateInicio}
                captionLayout="dropdown"
                onSelect={(selectedDate) => {
                  if (selectedDate) {
                    setDateInicio(selectedDate);
                    const formatted = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
                    setFormulario({ ...formulario, fecha_inicio: formatted });
                  }
                  setOpenInicio(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="fecha_fin">Fecha de din de membresia</Label>
          <Popover open={openFin} onOpenChange={setOpenFin}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="fecha_fin"
                className="justify-between font-normal"
              >
                {formulario.fecha_fin ? formulario.fecha_fin : "Selecciona una fecha"}
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFin}
                captionLayout="dropdown"
                onSelect={(selectedDate) => {
                  if (selectedDate) {
                    setDateFin(selectedDate);
                    const formatted = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
                    setFormulario({ ...formulario, fecha_fin: formatted });
                  }
                  setOpenFin(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button type="submit" >Registrar</Button>
      </form>

      {/* Modal de confirmación */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar registro</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas registrar este miembro?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancelar</Button>
            <Button onClick={enviarFormulario}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de resultado */}
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
  );
}
