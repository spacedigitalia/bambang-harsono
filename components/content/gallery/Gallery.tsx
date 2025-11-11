"use client"

import React from 'react'

import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'

import Image from 'next/image'

import { Pagination } from '@/hooks/pagination'

export default function Gallery({ galleryData }: { galleryData: Gallery[] }) {

    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 12;
    const totalPages = Math.ceil(galleryData.length / itemsPerPage);
    const currentItems = galleryData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const [selectedImage, setSelectedImage] = React.useState<Gallery | null>(null);

    return (
        <section className='py-8 sm:py-12 pt-20 sm:pt-28'>
            <div className='container px-4 md:px-8'>
                <div className="columns-2 sm:columns-3 gap-3 sm:gap-4">
                    {currentItems.map((data) => {
                        return (
                            <Dialog key={data._id}>
                                <DialogTrigger asChild>
                                    <div
                                        className="break-inside-avoid mb-3 sm:mb-4 cursor-pointer"
                                        onClick={() => setSelectedImage(data)}
                                    >
                                        <Image
                                            src={data.imageUrl}
                                            alt={"image"}
                                            width={800}
                                            height={600}
                                            loading='eager'
                                            className="w-full h-auto rounded-lg"
                                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                        />
                                    </div>
                                </DialogTrigger>

                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto z-[300]">
                                    <DialogTitle className="sr-only">Gallery Image View</DialogTitle>
                                    {selectedImage && (
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={selectedImage.imageUrl}
                                                alt="Selected image"
                                                width={1200}
                                                loading='eager'
                                                height={800}
                                                className="w-full h-auto object-contain rounded-lg"
                                                style={{ maxHeight: '80vh' }}
                                            />
                                        </div>
                                    )}
                                </DialogContent>
                            </Dialog>
                        );
                    })}
                </div>
                {totalPages > 1 && (
                    <div className="mt-8">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </section>
    )
}
