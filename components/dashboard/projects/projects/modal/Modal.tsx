"use client"

import React, { useState } from 'react'

import { Button } from '@/components/ui/button'

import { Upload, X, FileText, Link, Tag, Image as ImageIcon, Code, List } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import { Textarea } from "@/components/ui/textarea"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Badge } from "@/components/ui/badge"

import Image from "next/image"

import { toast } from "sonner"

import QuillEditor from '@/hooks/QuillEditor'

import { cn } from "@/lib/utils"

export default function Modal({
    isOpen,
    onOpenChange,
    isEditing,
    formData,
    setFormData,
    categories,
    frameworks,
    onSubmit,
    isSubmitting
}: ModalProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploadingImages, setIsUploadingImages] = useState(false);
    const [draggedItem, setDraggedItem] = useState<number | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'title') {
            // Generate slug from title
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
                .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

            setFormData(prev => ({
                ...prev,
                title: value,
                slug: slug
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleCategoryChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            category: value
        }));
    };

    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingImages(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/projects/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload thumbnail');
            }

            const data = await response.json();
            setFormData(prev => ({
                ...prev,
                thumbnail: data.url
            }));
            toast.success('Thumbnail uploaded successfully');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to upload thumbnail');
        } finally {
            setIsUploadingImages(false);
        }
    };

    const handleFrameworkChange = (framework: Framework) => {
        setFormData(prev => {
            const isSelected = prev.frameworks.some(f => f.title === framework.title);
            if (isSelected) {
                return {
                    ...prev,
                    frameworks: prev.frameworks.filter(f => f.title !== framework.title)
                };
            } else {
                return {
                    ...prev,
                    frameworks: [...prev.frameworks, framework]
                };
            }
        });
    };

    const handleDragStart = (index: number) => {
        setDraggedItem(index);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
        e.preventDefault();
        setIsDragging(false);

        if (draggedItem === null) return;

        const newImageUrl = [...formData.imageUrl];
        const draggedImage = newImageUrl[draggedItem];
        newImageUrl.splice(draggedItem, 1);
        newImageUrl.splice(targetIndex, 0, draggedImage);

        setFormData(prev => ({
            ...prev,
            imageUrl: newImageUrl
        }));
        setDraggedItem(null);
    };

    const handleRemoveThumbnail = () => {
        setFormData(prev => ({
            ...prev,
            thumbnail: ''
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        setIsUploadingImages(true);
        try {
            const uploadedUrls: string[] = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('/api/projects/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Failed to upload image');
                }

                const data = await response.json();
                uploadedUrls.push(data.url);
            }

            setFormData(prev => ({
                ...prev,
                imageUrl: [...prev.imageUrl, ...uploadedUrls]
            }));
            toast.success('Images uploaded successfully');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to upload images');
        } finally {
            setIsUploadingImages(false);
        }
    };

    const handleRemoveImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            imageUrl: prev.imageUrl.filter((_, i) => i !== index)
        }));
    };

    const handleAdditionalImagesDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (!files || files.length === 0) return;

        setIsUploadingImages(true);
        try {
            const uploadedUrls: string[] = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (!file.type.startsWith('image/')) {
                    toast.error('Please drop only image files');
                    continue;
                }

                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('/api/projects/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Failed to upload image');
                }

                const data = await response.json();
                uploadedUrls.push(data.url);
            }

            if (uploadedUrls.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    imageUrl: [...prev.imageUrl, ...uploadedUrls]
                }));
                toast.success('Images uploaded successfully');
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to upload images');
        } finally {
            setIsUploadingImages(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        {isEditing ? 'Edit' : 'Create'} Project
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        {isEditing ? 'Update' : 'Fill in'} the details below to {isEditing ? 'update' : 'create new'} project
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-6 overflow-y-auto pr-2 py-4">
                    {/* Left Column - Basic Information */}
                    <div className='space-y-6'>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
                                <FileText className="w-5 h-5 text-primary" />
                                <h3>Basic Information</h3>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-muted-foreground" />
                                        Title
                                    </Label>

                                    <Input
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Enter content title"
                                        required
                                        className="w-full transition-colors focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug" className="text-sm font-medium flex items-center gap-2">
                                        <Link className="w-4 h-4 text-muted-foreground" />
                                        Project Slug
                                    </Label>
                                    <Input
                                        id="slug"
                                        name="slug"
                                        readOnly
                                        value={formData.slug}
                                        onChange={handleChange}
                                        placeholder="Enter project slug"
                                        required
                                        className="w-full transition-colors focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="previewLink" className="text-sm font-medium flex items-center gap-2">
                                        <Link className="w-4 h-4 text-muted-foreground" />
                                        Preview Link
                                    </Label>
                                    <Input
                                        id="previewLink"
                                        name="previewLink"
                                        value={formData.previewLink}
                                        onChange={handleChange}
                                        placeholder="Enter project preview link"
                                        className="w-full transition-colors focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category" className="text-sm font-medium flex items-center gap-2">
                                        <Tag className="w-4 h-4 text-muted-foreground" />
                                        Category
                                    </Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={handleCategoryChange}
                                        required
                                    >
                                        <SelectTrigger className="w-full transition-colors focus:ring-2 focus:ring-primary/20">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category, index) => (
                                                <SelectItem key={`${category}-${index}`} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
                                <Code className="w-5 h-5 text-primary" />
                                <h3>Content Details</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-muted-foreground" />
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Enter content description"
                                        required
                                        className="min-h-[100px] transition-colors focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="content" className="text-sm font-medium flex items-center gap-2">
                                        <Code className="w-4 h-4 text-muted-foreground" />
                                        Content
                                    </Label>
                                    <QuillEditor
                                        value={formData.content}
                                        onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                                        placeholder="Enter content details"
                                        height="200px"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
                                <List className="w-5 h-5 text-primary" />
                                <h3>Frameworks</h3>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50">
                                {frameworks.map((framework) => (
                                    <div
                                        key={framework.title}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200",
                                            formData.frameworks.some(f => f.title === framework.title)
                                                ? "bg-primary/10 border-primary/50"
                                                : "hover:bg-muted/80 border-muted-foreground/25"
                                        )}
                                    >
                                        <input
                                            type="checkbox"
                                            id={framework.title}
                                            checked={formData.frameworks.some(f => f.title === framework.title)}
                                            onChange={() => handleFrameworkChange(framework)}
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary transition-colors"
                                        />
                                        <label
                                            htmlFor={framework.title}
                                            className="flex items-center gap-2 text-sm font-medium leading-none cursor-pointer"
                                        >
                                            <Image
                                                src={framework.imageUrl}
                                                alt={framework.title}
                                                className="w-5 h-5 object-contain"
                                                width={100}
                                                height={100}
                                            />
                                            {framework.title}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            {formData.frameworks.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.frameworks.map((framework) => (
                                        <Badge
                                            key={framework.title}
                                            variant="secondary"
                                            className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                        >
                                            <Image
                                                src={framework.imageUrl}
                                                alt={framework.title}
                                                className="w-4 h-4 object-contain"
                                                width={100}
                                                height={100}
                                            />
                                            {framework.title}
                                            <button
                                                type="button"
                                                onClick={() => handleFrameworkChange(framework)}
                                                className="ml-1 hover:text-destructive transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Media */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
                                <ImageIcon className="w-5 h-5 text-primary" />
                                <h3>Thumbnail</h3>
                            </div>

                            <div className="space-y-2">
                                {formData.thumbnail ? (
                                    <div className="relative group">
                                        <div className="border rounded-lg overflow-hidden">
                                            <Image
                                                src={formData.thumbnail}
                                                alt="Thumbnail preview"
                                                className="w-full h-48 object-contain"
                                                width={100}
                                                height={100}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={handleRemoveThumbnail}
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div
                                        className={cn(
                                            "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                                            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
                                            "relative"
                                        )}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={(e) => handleDrop(e, 0)}
                                    >
                                        <Input
                                            id="thumbnail"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleThumbnailUpload}
                                            className="hidden"
                                        />
                                        <div className="flex flex-col items-center gap-2">
                                            <Upload className="w-8 h-8 text-muted-foreground" />
                                            <div className="text-sm text-muted-foreground">
                                                <p>Drag and drop your thumbnail here, or</p>
                                                <Button
                                                    type="button"
                                                    variant="link"
                                                    onClick={() => document.getElementById('thumbnail')?.click()}
                                                    disabled={isUploadingImages}
                                                    className="text-primary hover:text-primary/80"
                                                >
                                                    browse
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Additional Images Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
                                <ImageIcon className="w-5 h-5 text-primary" />
                                <h3>Additional Images</h3>
                            </div>

                            <div className="space-y-4">
                                {/* Image Grid */}
                                {formData.imageUrl.length > 0 && (
                                    <div className="max-h-[400px] overflow-y-auto pr-2">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            {formData.imageUrl.map((url, index) => (
                                                <div
                                                    key={url}
                                                    draggable
                                                    onDragStart={() => handleDragStart(index)}
                                                    onDragOver={handleDragOver}
                                                    onDragLeave={handleDragLeave}
                                                    onDrop={(e) => handleDrop(e, index)}
                                                    className={cn(
                                                        "relative group cursor-move",
                                                        isDragging && "opacity-50"
                                                    )}
                                                >
                                                    <div className="border rounded-lg overflow-hidden">
                                                        <Image
                                                            src={url}
                                                            alt={`Project image ${index + 1}`}
                                                            className="w-full h-40 object-cover"
                                                            width={100}
                                                            height={100}
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                                                            }}
                                                        />
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleRemoveImage(index)}
                                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-50"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <div className="text-white text-sm font-medium">
                                                            Drag to reorder
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Upload Button - Only show when no images */}
                                {formData.imageUrl.length === 0 && (
                                    <div
                                        className={cn(
                                            "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                                            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
                                            "relative"
                                        )}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleAdditionalImagesDrop}
                                    >
                                        <Input
                                            id="images"
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            disabled={isUploadingImages}
                                        />
                                        <div className="flex flex-col items-center gap-2">
                                            <Upload className="w-8 h-8 text-muted-foreground" />
                                            <div className="text-sm text-muted-foreground">
                                                <p>Drag and drop your images here, or</p>
                                                <Button
                                                    type="button"
                                                    variant="link"
                                                    onClick={() => document.getElementById('images')?.click()}
                                                    disabled={isUploadingImages}
                                                    className="text-primary hover:text-primary/80"
                                                >
                                                    Select Files
                                                </Button>
                                            </div>
                                            {isUploadingImages && (
                                                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                                                    <div className="flex items-center gap-2">
                                                        <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        <span>Uploading...</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="border-t pt-4 mt-6">
                        <Button
                            type="submit"
                            disabled={isUploadingImages || isSubmitting}
                            className="w-full sm:w-auto hover:scale-105 transition-all duration-300"
                        >
                            {isSubmitting ? `${isEditing ? 'Updating' : 'Creating'}...` : `${isEditing ? 'Update' : 'Create'} Content`}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}