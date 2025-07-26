// components/modals/ModalEditarArticulo.tsx
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PerfilUsuario from './PerfilUsuario';

type Props = {
  open: boolean;
  onClose: () => void;
  id_usuario: string | null;
  onSuccess?: () => void;
};

export default function ModalInformacion({ open, onClose, id_usuario, onSuccess }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Información del miembro</DialogTitle>
        </DialogHeader>
        {id_usuario ? (
          <PerfilUsuario id_usuario={id_usuario} />
        ) : (
          <p className="text-sm text-gray-500">Cargando información del usuario...</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
