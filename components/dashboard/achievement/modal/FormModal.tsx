"use client"

import Image from 'next/image'

import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export interface FormModalProps {
    isOpen: boolean;
    onClose: () => void;
    isEditing: boolean;
    formData: Achievement;
    setFormData: (data: Achievement) => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    isUploading: boolean;
    isSubmitting: boolean;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
}

export default function FormModal({
    isOpen,
    onClose,
    isEditing,
    formData,
    setFormData,
    fileInputRef,
    isUploading,
    isSubmitting,
    handleImageUpload,
    handleSubmit
}: FormModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] p-4 sm:p-6">
                <DialogHeader className="mb-4 sm:mb-6">
                    <DialogTitle className="text-xl sm:text-2xl font-bold">
                        {isEditing ? 'Edit Achievement' : 'Create Achievement'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="space-y-4 sm:space-y-6">
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                            <div className="relative w-full h-64 sm:h-72">
                                {formData.imageUrl ? (
                                    <Image
                                        src={formData.imageUrl}
                                        alt="Preview"
                                        fill
                                        className="object-cover rounded-xl shadow-sm"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-muted rounded-xl flex items-center justify-center border-2 border-dashed border-border relative">
                                        <span className="text-muted-foreground text-sm">No image</span>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageUpload}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isUploading}
                                            className="absolute inset-0 m-auto w-fit h-fit px-6 py-3 border-2 border-dashed hover:border-primary/50 transition-colors"
                                        >
                                            {isUploading ? 'Uploading...' : 'Upload Image'}
                                        </Button>
                                    </div>
                                )}
                            </div>
                            {!formData.imageUrl && (
                                <div className="flex-1">
                                </div>
                            )}
                        </div>
                        <Input
                            placeholder="Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="h-12"
                        />
                    </div>
                    <Button type="submit" className="w-full h-12 text-base font-medium" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Create'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}