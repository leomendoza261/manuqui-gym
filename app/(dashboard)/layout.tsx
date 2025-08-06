import Link from 'next/link';
import {
  Blocks,
  ClipboardPen,
  Dumbbell,
  Home,
  PanelLeft,
  Settings,
  UserIcon,
  Users2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Analytics } from '@vercel/analytics/react';
import { User } from './user';
import Providers from './providers';
import { NavItem } from './nav-item';

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { headers } from 'next/headers';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const headersList = await headers();
  const pathname = headersList.get('x-next-pathname') || '';

  if (!session?.user?.email) {
    redirect('/api/auth/signin');
  }

  const { data: usuario, error } = await supabase
    .from('usuarios')
    .select('rol')
    .eq('email', session.user.email)
    .maybeSingle();

  if (!usuario && !pathname.includes('/completar_perfil')) {
    console.log('Usuario sin perfil, redirigiendo...');
    redirect('/completar_perfil');
  }

  const rol = usuario?.rol || "miembro";

  return (
    <Providers>
      <main className="flex min-h-screen w-full flex-col bg-muted/40">
        <DesktopNav rol={rol} />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <MobileNav rol={rol} />
            <h1 className='font-bold text-xl'>Manuqui Gym</h1>
            {/* <SearchInput />
            <User /> */}
          </header>
          <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
            {children}
          </main>
        </div>
        <Analytics />
      </main>
    </Providers>
  );
}

function DesktopNav({ rol }: { rol: string }) {

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <User />

        <NavItem href="/" label="Inicio">
          <Home className="h-5 w-5" />
        </NavItem>

        {/* Solo para admins */}
        {rol === 'administrador' && (
          <>
            <NavItem href="/miembros" label="Miembros">
              <Users2 className="h-5 w-5" />
            </NavItem>
            {/* <NavItem href="/entrenadores" label="Entrenadores">
              <UserIcon className="h-5 w-5" />
            </NavItem> */}
            <NavItem href="/rutinas" label="Rutinas">
              <ClipboardPen className="h-5 w-5" />
            </NavItem>
          </>
        )}

        {rol === 'entrenador' && (
          <>
            <NavItem href="/perfil" label="Mi Perfil">
              <UserIcon className="h-5 w-5" />
            </NavItem>
            <NavItem href="/rutinas" label="Rutinas">
              <ClipboardPen className="h-5 w-5" />
            </NavItem>
            <NavItem href="/misrutinas" label="Mis Rutinas">
              <Dumbbell className="h-5 w-5" />
            </NavItem>
          </>
        )}

        {rol === 'miembro' && (
          <>
            <NavItem href="/perfil" label="Mi Perfil">
              <UserIcon className="h-5 w-5" />
            </NavItem>
            <NavItem href="/misrutinas" label="Mis Rutinas">
              <Dumbbell className="h-5 w-5" />
            </NavItem>
          </>
        )}

        <NavItem href="/ejercicios" label="Ejercicios">
          <Blocks className="h-5 w-5" />
        </NavItem>


      </nav>
      {/* <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </nav> */}
    </aside>
  );
}

function MobileNav({ rol }: { rol: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <User />
          <SheetClose asChild>
            <Link
              href="/"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Home className="h-5 w-5" />
              Inicio
            </Link>
          </SheetClose>


          {rol === 'administrador' && (
            <>
              <SheetClose asChild>
                <Link
                  href="/miembros"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Users2 className="h-5 w-5" />
                  Miembros
                </Link>
              </SheetClose>
              {/* <SheetClose asChild>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <UserIcon className="h-5 w-5" />
                  Entrenadores
                </Link>
              </SheetClose> */}
              <SheetClose asChild>
                <Link
                  href="/rutinas"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <ClipboardPen className="h-5 w-5" />
                  Rutinas
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/perfil"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <UserIcon className="h-5 w-5" />
                  Mi perfil
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/misrutinas"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Dumbbell className="h-5 w-5" />
                  Mis Rutinas
                </Link>
              </SheetClose>
            </>
          )}

          {rol === 'entrenador' && (
            <>
              <SheetClose asChild>
                <Link
                  href="/perfil"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <UserIcon className="h-5 w-5" />
                  Mi perfil
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/rutinas"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <ClipboardPen className="h-5 w-5" />
                  Rutinas
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/misrutinas"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Dumbbell className="h-5 w-5" />
                  Mis Rutinas
                </Link>
              </SheetClose>

            </>
          )}

          {rol === 'miembro' && (
            <>
              <SheetClose asChild>
                <Link
                  href="/perfil"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <UserIcon className="h-5 w-5" />
                  Mi perfil
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/misrutinas"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Dumbbell className="h-5 w-5" />
                  Mis Rutinas
                </Link>
              </SheetClose>

            </>
          )}

          <SheetClose asChild>
            <Link
              href="/ejercicios"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Blocks className="h-5 w-5" />
              Ejercicios
            </Link>
          </SheetClose>

        </nav>
      </SheetContent>
    </Sheet>
  );
}


