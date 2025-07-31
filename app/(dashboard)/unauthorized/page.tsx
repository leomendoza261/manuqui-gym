'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { MailWarning } from 'lucide-react'

export default function MisRutinasPage() {

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Tu cuenta aun no se encuentra registrada</CardTitle>
          <CardDescription>Contactate con el administrador del gimnasio</CardDescription>
        </CardHeader>
        <CardContent>
          <MailWarning className='h-20 w-20 text-red-500'/>
          <span>Solicita que se registre tu cuenta con el correo que usaras para iniciar sesion con el administrador.</span>
        </CardContent>
      </Card>
    </div>
  )
}
