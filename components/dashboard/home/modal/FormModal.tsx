"use client"

import { Plus, X, Image as ImageIcon } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog"

import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'

import { Textarea } from '@/components/ui/textarea'

import Image from 'next/image'

export function FormModal({
    isOpen,
    setIsOpen,
    selectedContent,
    formData,
    setFormData,
    imagePreview,
    setSelectedImage,
    setImagePreview,
    handleImageChange,
    handleSubmit,
    isSubmitting,
    isUploadingImage,
    triggerButton,
}: FormModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {triggerButton}
            </DialogTrigger>
            <DialogContent className="sm:max-w-7xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>
                        {selectedContent ? 'Edit Section' : 'Add New Section'}
                    </DialogTitle>
                    <DialogDescription>
                        {selectedContent
                            ? 'Update the details below to modify this section.'
                            : 'Fill in the details below to create a new section for your home page.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 overflow-y-auto pr-2 py-4">
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="title">Title</label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="email">Email</label>
                            <Input
                                id="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2 col-span-2">
                            <label>Links</label>
                            <div className="space-y-3">
                                {formData.links.map((link, index) => (
                                    <div key={index} className="flex gap-2 items-start">
                                        <div className="grid gap-2 flex-1">
                                            <Input
                                                placeholder="Label"
                                                value={link.label}
                                                onChange={(e) => {
                                                    const newLinks = [...formData.links];
                                                    newLinks[index].label = e.target.value;
                                                    setFormData({ ...formData, links: newLinks });
                                                }}
                                            />
                                        </div>
                                        <div className="grid gap-2 flex-1">
                                            <Input
                                                placeholder="Href"
                                                value={link.href}
                                                onChange={(e) => {
                                                    const newLinks = [...formData.links];
                                                    newLinks[index].href = e.target.value;
                                                    setFormData({ ...formData, links: newLinks });
                                                }}
                                            />
                                        </div>
                                        {formData.links.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    const newLinks = formData.links.filter((_, i) => i !== index);
                                                    setFormData({ ...formData, links: newLinks });
                                                }}
                                                className="mt-0"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setFormData({
                                            ...formData,
                                            links: [...formData.links, { label: '', href: '' }]
                                        });
                                    }}
                                    className="w-full"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Link
                                </Button>
                            </div>
                        </div>
                        <div className="grid gap-2 col-span-2">
                            <label htmlFor="name">Name</label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2 col-span-2">
                            <label htmlFor="text">Text</label>
                            <Input
                                id="text"
                                value={formData.text}
                                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2 col-span-2">
                            <label htmlFor="image">Image</label>
                            <div className="space-y-3">
                                <div className="flex items-center gap-4">
                                    <label
                                        htmlFor="image-upload"
                                        className="flex items-center justify-center w-full aspect-video border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors overflow-hidden"
                                    >
                                        {imagePreview ? (
                                            <Image
                                                src={imagePreview}
                                                alt="Preview"
                                                width={500}
                                                height={500}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                                <ImageIcon className="w-8 h-8" />
                                                <span className="text-sm">Click to upload image</span>
                                            </div>
                                        )}
                                    </label>
                                    <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </div>
                                {imagePreview && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedImage(null)
                                            setImagePreview(null)
                                            setFormData({ ...formData, image: '' })
                                        }}
                                        className="w-full"
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Remove Image
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-2 col-span-2">
                            <label htmlFor="description">Description</label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="col-span-2">
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full px-6 py-2.5 font-medium shadow-sm hover:shadow-md transition-all"
                            >
                                {isSubmitting || isUploadingImage ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        {isUploadingImage ? 'Uploading image...' : selectedContent ? 'Updating...' : 'Creating...'}
                                    </div>
                                ) : (
                                    selectedContent ? 'Update' : 'Create'
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

