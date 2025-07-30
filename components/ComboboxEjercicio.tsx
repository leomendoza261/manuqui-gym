'use client'

import * as React from 'react'
import Image from 'next/image'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type Ejercicio = {
  id: string
  nombre: string
  grupo_muscular: string
  imagen_url: string
}

interface Props {
  ejercicios: Ejercicio[]
  value: string
  onChange: (id: string) => void
}

export function ComboboxEjercicio({ ejercicios, value, onChange }: Props) {
  const [open, setOpen] = React.useState(false)
  const selected = ejercicios.find((e) => e.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full flex items-center justify-between gap-2 overflow-hidden"
        >
          <span
            className="block flex-1 truncate text-left"
            title={selected ? `${selected.nombre} (${selected.grupo_muscular})` : ''}
          >
            {selected ? `${selected.nombre} (${selected.grupo_muscular})` : 'Seleccionar ejercicio'}
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Buscar ejercicio..." />
          <CommandList>
            <CommandEmpty>No se encontraron ejercicios.</CommandEmpty>
            <CommandGroup>
              {ejercicios.map((ej) => (
                <CommandItem
                  key={ej.id}
                  value={ej.id}
                  onSelect={() => {
                    onChange(ej.id)
                    setOpen(false)
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Image src={ej.imagen_url} alt="" width={48} height={48} />
                    <span>{ej.nombre}{/*  - <span className='text-xs'>{ej.grupo_muscular}</span> */}</span>
                  </div>
                  <Check className={cn('ml-auto h-4 w-4 ', ej.id === value ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
