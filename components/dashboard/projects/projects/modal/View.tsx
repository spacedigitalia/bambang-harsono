import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

import { Badge } from "@/components/ui/badge"

import { FileText, Code, List, Image as ImageIcon, Tag, Link } from "lucide-react"

import Image from "next/image"

export default function View({ isOpen, onOpenChange, selectedProject }: ViewProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        Project Details
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        View the complete details of the project
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 overflow-y-auto pr-2 py-4">
                    {/* Thumbnail Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
                            <ImageIcon className="w-5 h-5 text-primary" />
                            <h3>Thumbnail</h3>
                        </div>

                        <div className="space-y-2">
                            {selectedProject?.thumbnail ? (
                                <div className="border rounded-lg overflow-hidden">
                                    <Image
                                        src={selectedProject.thumbnail}
                                        alt="Thumbnail preview"
                                        className="w-full h-64 object-cover"
                                        width={100}
                                        height={100}
                                    />
                                </div>
                            ) : (
                                <div className="border rounded-lg p-6 text-center bg-muted/50">
                                    <span className="text-muted-foreground">No thumbnail available</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content Details and Frameworks */}
                    <div className='space-y-6'>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
                                <FileText className="w-5 h-5 text-primary" />
                                <h3>Project Details</h3>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className="space-y-2">
                                    <div className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                                        <Tag className="w-4 h-4" />
                                        Category
                                    </div>
                                    <div className="p-2 rounded-md bg-muted/50 border">
                                        <Badge variant="secondary">{selectedProject?.category}</Badge>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                                        <Link className="w-4 h-4" />
                                        Preview Link
                                    </div>
                                    {selectedProject?.previewLink ? (
                                        <a
                                            href={selectedProject.previewLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-md bg-muted/50 border flex items-center gap-2 text-primary hover:bg-muted/80 transition-colors"
                                        >
                                            <Link className="w-4 h-4" />
                                            {selectedProject.previewLink}
                                        </a>
                                    ) : (
                                        <div className="p-2 rounded-md bg-muted/50 border text-muted-foreground">
                                            No preview link available
                                        </div>
                                    )}
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
                                    <div className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                                        <FileText className="w-4 h-4" />
                                        Description
                                    </div>
                                    <div className="p-3 rounded-md bg-muted/50 border min-h-[100px]">
                                        {selectedProject?.description}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
                                <List className="w-5 h-5 text-primary" />
                                <h3>Frameworks</h3>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50">
                                {selectedProject?.frameworks.map((framework) => (
                                    <div
                                        key={framework.title}
                                        className="flex items-center gap-3 p-3 rounded-lg border bg-primary/10 border-primary/50"
                                    >
                                        <Image
                                            src={framework.imageUrl}
                                            alt={framework.title}
                                            className="w-5 h-5 object-contain"
                                            width={100}
                                            height={100}
                                        />
                                        <span className="text-sm font-medium leading-none">
                                            {framework.title}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Additional Images Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
                            <ImageIcon className="w-5 h-5 text-primary" />
                            <h3>Additional Images</h3>
                        </div>

                        <div className="space-y-4">
                            {selectedProject?.imageUrl && selectedProject.imageUrl.length > 0 ? (
                                <div className="max-h-[400px]">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {selectedProject.imageUrl.map((url, index) => (
                                            <div
                                                key={url}
                                                className="border rounded-lg overflow-hidden"
                                            >
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
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="border rounded-lg p-6 text-center bg-muted/50">
                                    <span className="text-muted-foreground">No additional images available</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}