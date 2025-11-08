"use client"

import { Button } from '@/components/ui/button'

import { ChevronRight, FileText, Link, X, Eye } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"

import Image from "next/image"

import { Badge } from "@/components/ui/badge"

import Modal from '@/components/dashboard/projects/projects/modal/Modal'

import Delete from '@/components/dashboard/projects/projects/modal/Delete'

import View from '@/components/dashboard/projects/projects/modal/View'

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import { Pagination } from '@/hooks/pagination'

import ProjectsSkeleton from '@/components/dashboard/projects/projects/ProjectsSkeleton'

import { useStateProject } from '@/components/dashboard/projects/projects/lib/useStateProject'

export default function ProjectsLayout() {
    const {
        isOpen,
        setIsOpen,
        isDeleteOpen,
        setIsDeleteOpen,
        isViewOpen,
        setIsViewOpen,
        isUploading,
        isSubmitting,
        isDeleting,
        setDeleteContentId,
        categories,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        frameworks,
        filteredProjects,
        currentProjects,
        currentPage,
        totalPages,
        handlePageChange,
        isEditing,
        setIsEditing,
        formData,
        setFormData,
        isLoading,
        selectedProject,
        handleEdit,
        handleSubmit,
        handleDeleteClick,
        handleDelete,
        handleView,
    } = useStateProject();

    return (
        <section className="p-4 md:p-6 bg-muted/30 rounded-2xl">
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 border rounded-2xl border-border bg-card shadow-sm gap-4'>
                <div className='flex flex-col gap-3'>
                    <h3 className='text-2xl md:text-3xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent'>
                        Projects
                    </h3>

                    <ol className='flex gap-2 items-center text-sm text-muted-foreground'>
                        <li className='flex items-center hover:text-primary transition-colors'>
                            <span>Dashboard</span>
                            <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground" />
                        </li>
                        <li className='flex items-center text-primary font-medium'>
                            <span>Projects</span>
                        </li>
                    </ol>
                </div>

                <Button
                    variant="default"
                    className="w-full md:w-auto px-6 py-2.5 font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                    onClick={() => setIsOpen(true)}
                >
                    Create Content
                </Button>
            </div>

            {/* Filters Section */}
            <div className="mt-6 p-4 border rounded-2xl border-border bg-card shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="w-full md:w-[300px]">
                        <Label className="text-sm font-medium mb-2 block">Search Projects</Label>
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder="Search by title..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pr-8"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="w-full md:w-[200px]">
                        <Label className="text-sm font-medium mb-2 block">Filter by Category</Label>
                        <Select
                            value={selectedCategory}
                            onValueChange={setSelectedCategory}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Project Content Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6">
                {isLoading ? (
                    <ProjectsSkeleton />
                ) : filteredProjects.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/50">
                        <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Content Found</h3>
                        <p className="text-muted-foreground mb-4">
                            {searchQuery
                                ? `No projects found matching "${searchQuery}"${selectedCategory !== 'all' ? ` in the "${selectedCategory}" category` : ''}.`
                                : selectedCategory === 'all'
                                    ? "There are no projects available at the moment."
                                    : `No projects found in the "${selectedCategory}" category.`}
                        </p>
                        <Button
                            variant="default"
                            onClick={() => setIsOpen(true)}
                            className="hover:scale-105 transition-all duration-300"
                        >
                            Create Your First Project
                        </Button>
                    </div>
                ) : (
                    currentProjects.map((content) => (
                        <Card key={content._id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group border-border/50 hover:border-primary/20 p-0">
                            <div className="relative w-full h-64 overflow-hidden">
                                {content.thumbnail ? (
                                    <Image
                                        src={content.thumbnail}
                                        alt={content.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-muted/50 flex items-center justify-center">
                                        <span className="text-muted-foreground">No thumbnail</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                    <a
                                        href={`/projects/${content.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white hover:text-primary transition-colors flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm"
                                    >
                                        <Link className="w-4 h-4" />
                                        <span className="text-sm font-medium">View Project</span>
                                    </a>
                                </div>
                            </div>

                            <CardHeader className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="hover:bg-primary/10 transition-colors text-xs">
                                        {content.category}
                                    </Badge>
                                </div>
                                <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors text-xl">{content.title}</CardTitle>
                                <CardDescription className="line-clamp-2 text-sm text-muted-foreground">{content.description}</CardDescription>
                            </CardHeader>

                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {content.frameworks.map((framework) => (
                                        <Badge
                                            key={framework.title}
                                            variant="outline"
                                            className="hover:bg-muted transition-colors text-xs"
                                        >
                                            {framework.title}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>

                            <CardFooter className="flex justify-between gap-2 border-t bg-muted/30 py-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleView(content)}
                                    className="flex-1 hover:bg-primary/10 transition-colors"
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(content)}
                                    className="flex-1 hover:bg-primary/10 transition-colors"
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteClick(content._id)}
                                    className="flex-1 hover:bg-destructive/90 transition-colors"
                                >
                                    Delete
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>

            {/* Pagination */}
            {!isLoading && filteredProjects.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    className="mt-8"
                />
            )}

            {/* Form Modal */}
            <Modal
                isOpen={isOpen}
                onOpenChange={(open) => {
                    setIsOpen(open);
                    if (!open) {
                        setIsEditing(false);
                        setFormData({
                            _id: '',
                            title: '',
                            slug: '',
                            description: '',
                            content: '',
                            category: '',
                            thumbnail: '',
                            imageUrl: [],
                            previewLink: '',
                            frameworks: []
                        });
                    }
                }}
                isEditing={isEditing}
                formData={formData}
                setFormData={setFormData}
                categories={categories}
                frameworks={frameworks}
                onSubmit={handleSubmit}
                isUploading={isUploading}
                isSubmitting={isSubmitting}
            />

            {/* Delete Dialog */}
            <Delete
                isOpen={isDeleteOpen}
                onOpenChange={(open) => {
                    setIsDeleteOpen(open);
                    if (!open) {
                        setDeleteContentId(undefined);
                    }
                }}
                onDelete={handleDelete}
                isDeleting={isDeleting}
            />

            {/* View Modal */}
            <View
                isOpen={isViewOpen}
                onOpenChange={setIsViewOpen}
                selectedProject={selectedProject}
            />
        </section>
    );
}