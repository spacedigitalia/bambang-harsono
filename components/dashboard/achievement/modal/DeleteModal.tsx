"use client"

import { Button } from '@/components/ui/button'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isDeleting: boolean;
}

export default function DeleteModal({
    isOpen,
    onClose,
    onConfirm,
    isDeleting
}: DeleteModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] p-4 sm:p-6">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-lg sm:text-xl font-bold">Confirm Delete</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-muted-foreground">Are you sure you want to delete this achievement?</p>
                </div>
                <div className="flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="px-6"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        className="px-6"
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}