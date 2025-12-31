import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function Loading() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="mb-4">
                <div className="h-9 w-24 bg-zinc-100 rounded-md animate-pulse" />
            </div>

            <div className="space-y-4 border-b pb-6">
                <Skeleton className="h-10 w-3/4" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>
            </div>

            <div className="py-6 space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
            </div>

            <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
            </div>

            <div className="mt-8 space-y-6">
                <Skeleton className="h-8 w-40" />
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-6 w-6 rounded-full" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <Skeleton className="h-4 w-16" />
                            </div>
                            <Skeleton className="h-4 w-full" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
