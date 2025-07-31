'use client'

import TablaEjercicios from '@/components/ejercicios/TablaEjercicios'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card'

export default function MisRutinasPage() {

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Ejercicios</CardTitle>
                    <CardDescription>Listado de ejercicios.</CardDescription>
                </CardHeader>
                <CardContent>
                    <TablaEjercicios />
                </CardContent>
            </Card>
        </div>
    )
}
