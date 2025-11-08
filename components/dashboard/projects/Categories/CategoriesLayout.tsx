"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Pencil, Trash2, Plus, FolderPlus, Loader2 } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface Category {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export default function CategoriesLayout() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({
        name: ''
    });

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            if (Array.isArray(data)) {
                setCategories(data);
            } else {
                console.error('Expected array of categories but got:', data);
                setCategories([]);
                toast.error('Invalid data format received');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
            toast.error('Failed to fetch categories');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const url = '/api/categories';
            const method = editingCategory ? 'PUT' : 'POST';
            const body = editingCategory
                ? { id: editingCategory._id, ...formData }
                : formData;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!response.ok) throw new Error('Failed to save category');

            toast.success(`Category ${editingCategory ? 'updated' : 'created'} successfully`);
            setIsDialogOpen(false);
            fetchCategories();
            resetForm();
        } catch {
            toast.error(`Failed to ${editingCategory ? 'update' : 'create'} category`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!categoryToDelete) return;

        setIsDeleting(true);
        try {
            const response = await fetch('/api/categories', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: categoryToDelete._id })
            });

            if (!response.ok) throw new Error('Failed to delete category');

            toast.success('Category deleted successfully');
            fetchCategories();
            setIsDeleteDialogOpen(false);
            setCategoryToDelete(null);
        } catch {
            toast.error('Failed to delete category');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name
        });
        setIsDialogOpen(true);
    };

    const handleDeleteClick = (category: Category) => {
        setCategoryToDelete(category);
        setIsDeleteDialogOpen(true);
    };

    const resetForm = () => {
        setFormData({ name: '' });
        setEditingCategory(null);
    };

    return (
        <section className="p-6 bg-muted/30 rounded-2xl">
            <div className='flex justify-between items-center p-6 border rounded-2xl border-border bg-card shadow-sm mb-6'>
                <div className='flex flex-col gap-3'>
                    <h3 className='text-3xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent'>
                        Categories
                    </h3>

                    <ol className='flex gap-2 items-center text-sm text-muted-foreground'>
                        <li className='flex items-center hover:text-primary transition-colors'>
                            <span>Dashboard</span>
                            <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground" />
                        </li>
                        <li className='flex items-center text-primary font-medium'>
                            <span>Categories</span>
                        </li>
                    </ol>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button variant="default" className="px-6 py-2.5 font-medium shadow-sm hover:shadow-md transition-all">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] p-0">
                        <div className="px-6 py-6 border-b">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold">{editingCategory ? 'Edit Category' : 'Create Category'}</DialogTitle>
                                <DialogDescription>
                                    {editingCategory
                                        ? 'Edit your category details below.'
                                        : 'Fill in the information below to create a new category.'}
                                </DialogDescription>
                            </DialogHeader>
                        </div>

                        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium">Category Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter category name"
                                    className="w-full"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setIsDialogOpen(false);
                                        resetForm();
                                    }}
                                    disabled={isSubmitting}
                                    className="px-4"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            {editingCategory ? 'Updating...' : 'Creating...'}
                                        </>
                                    ) : (
                                        editingCategory ? 'Update Category' : 'Create Category'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-2xl border-border bg-card shadow-sm">
                {isLoading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">Loading categories...</p>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="p-4 rounded-full bg-primary/10">
                                <FolderPlus className="w-12 h-12 text-primary" />
                            </div>
                            <div className="space-y-2 max-w-sm mx-auto">
                                <h3 className="text-xl font-semibold">No Categories Found</h3>
                                <p className="text-sm text-muted-foreground">
                                    Categories help you organize your content. Get started by creating your first category.
                                </p>
                            </div>
                            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                                setIsDialogOpen(open);
                                if (!open) resetForm();
                            }}>
                                <DialogTrigger asChild>
                                    <Button variant="default" className="mt-4">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Your First Category
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Create Category</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Creating...
                                                </>
                                            ) : (
                                                'Create Category'
                                            )}
                                        </Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((category) => (
                                <TableRow key={category._id}>
                                    <TableCell>{category.name}</TableCell>
                                    <TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(category)}
                                            disabled={isSubmitting || isDeleting}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteClick(category)}
                                            disabled={isSubmitting || isDeleting}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader className="space-y-3">
                        <DialogTitle className="text-xl font-bold">Delete Category</DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                            Are you sure you want to delete the category &quot;{categoryToDelete?.name}&quot;? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end gap-3 pt-6">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDeleteDialogOpen(false);
                                setCategoryToDelete(null);
                            }}
                            disabled={isDeleting}
                            className="px-4"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="px-4"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    )
}