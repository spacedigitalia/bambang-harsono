import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"

import { Skeleton } from "@/components/ui/skeleton"

export default function ProjectsSkeleton() {
    return Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
            <div className="relative w-full h-48">
                <Skeleton className="w-full h-full" />
            </div>
            <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-6 w-16" />
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-2 border-t pt-4">
                <Skeleton className="h-9 w-full" />
            </CardFooter>
        </Card>
    ))
} 