'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import FormularioEditarMiembro from './FormularioEditarMiembro';

type Props = {
  open: boolean;
  onClose: () => void;
  id_usuario: string | null;
  onSuccess?: () => void;
};

export default function ModalEditar({ open, onClose, id_usuario, onSuccess }: Props) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-xl" >
                <DialogHeader>
                    <DialogTitle >Editar miembro</DialogTitle>
                </DialogHeader>
                <FormularioEditarMiembro id_usuario={id_usuario} onSuccess={onSuccess}/>
            </DialogContent>
        </Dialog>
    );
}
