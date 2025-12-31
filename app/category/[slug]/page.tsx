import { getThreads, CATEGORIES } from '@/lib/data';
import { ThreadList } from '@/components/forum/ThreadList';
import { notFound } from 'next/navigation';
import { Hash } from 'lucide-react';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    return CATEGORIES.map((category) => ({
        slug: category.slug,
    }));
}

export default async function CategoryPage(props: PageProps) {
    const params = await props.params;
    const category = CATEGORIES.find((c) => c.slug === params.slug);

    if (!category) {
        notFound();
    }

    const allThreads = await getThreads();
    const threads = allThreads.filter((t) => t.categoryId === category.id);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                        <Hash className="h-6 w-6 text-zinc-900 dark:text-zinc-50" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
                </div>
                <p className="text-muted-foreground text-zinc-500">
                    {category.description}
                </p>
            </div>

            {threads.length > 0 ? (
                <ThreadList threads={threads} />
            ) : (
                <div className="text-center py-12 text-muted-foreground">
                    No threads found in this category yet.
                </div>
            )}
        </div>
    );
}
