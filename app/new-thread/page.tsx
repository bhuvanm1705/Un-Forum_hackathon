'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CATEGORIES } from '@/lib/data';
import { createThreadInFirestore } from '@/lib/firestore'; // Import the function
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function NewThreadPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const [isAnonymous, setIsAnonymous] = useState(false);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const title = formData.get('title') as string;
        const categoryId = formData.get('category') as string;
        const content = formData.get('content') as string;

        const selectedCategory = CATEGORIES.find(c => c.id === categoryId);
        if (!selectedCategory) {
            alert("Invalid category");
            setLoading(false);
            return;
        }

        try {
            const authorData = isAnonymous ? {
                id: 'guest',
                name: "Anonymous User",
                avatar: "https://github.com/shadcn.png",
                role: "user" as const,
                joinedAt: new Date().toISOString()
            } : {
                id: user?.uid || 'guest',
                name: user?.displayName || "Anonymous User",
                avatar: user?.photoURL || "https://github.com/shadcn.png",
                role: "user" as const,
                joinedAt: new Date().toISOString()
            };

            await createThreadInFirestore({
                title,
                categoryId,
                content,
                author: authorData,
                authorId: authorData.id,
                category: selectedCategory,
                tags: [], // Default empty tags
                replyCount: 0,
                viewCount: 0,
                likes: 0
            });
            // Redirect to home to see the new thread
            router.push('/');
            router.refresh();
        } catch (error) {
            console.error("Failed to create thread", error);
            alert("Error creating thread. Check console.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <Link
                    href="/"
                    className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), "-ml-4 text-muted-foreground mb-4")}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Feed
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Start a New Discussion</h1>
                <p className="text-muted-foreground">
                    Share your thoughts, ask questions, or showcase your work.
                </p>
            </div>

            <form className="space-y-6" onSubmit={onSubmit}>
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Title
                    </label>
                    <Input name="title" placeholder="What is this discussion about?" required />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                        Category
                    </label>
                    <select name="category" className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300">
                        {CATEGORIES.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                        Content
                    </label>
                    <textarea
                        name="content"
                        className="flex min-h-[200px] w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
                        placeholder="Write your post content here (Markdown supported)..."
                        required
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="anonymous"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-0 focus:ring-offset-0 dark:border-zinc-700 dark:bg-zinc-950 dark:checked:bg-blue-600"
                    />
                    <label
                        htmlFor="anonymous"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Post anonymously (hide my real name)
                    </label>
                </div>

                <div className="flex justify-end gap-4">
                    <Link href="/" className={buttonVariants({ variant: 'ghost' })}>
                        Cancel
                    </Link>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Publishing...' : 'Publish Thread'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
