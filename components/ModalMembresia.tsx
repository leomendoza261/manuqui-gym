'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import FormularioRenovarMembresia from './FormularioRenovacionMembresia';

type Props = {
    open: boolean;
    onClose: () => void;
    idMembresia: number | null;
    onSuccess?: () => void;
};

export default function ModalMembresia({ open, onClose, idMembresia, onSuccess }: Props) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-xl" aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle >Renovar membresia</DialogTitle>
                </DialogHeader>
                <FormularioRenovarMembresia id_membresia={idMembresia} onSuccess={onSuccess}/>
            </DialogContent>
        </Dialog>
    );
}
