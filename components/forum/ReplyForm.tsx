'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createPostInFirestore } from '@/lib/firestore';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface ReplyFormProps {
    threadId: string;
    placeholder?: string;
}

export function ReplyForm({ threadId, placeholder = "Type your reply here..." }: ReplyFormProps) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    async function handleSubmit() {
        if (!content.trim() || !user) return;
        setLoading(true);
        try {
            await createPostInFirestore({
                threadId,
                content,
                authorId: user.uid,
                author: {
                    id: user.uid,
                    name: user.displayName || 'Anonymous',
                    avatar: user.photoURL || "https://github.com/shadcn.png",
                    role: 'user',
                    joinedAt: new Date().toISOString()
                },
                likes: 0
            });
            setContent('');
            router.refresh(); // Refresh to show new post
        } catch (error) {
            console.error(error);
            alert('Failed to post reply');
        } finally {
            setLoading(false);
        }
    }

    if (!user) {
        return (
            <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-md text-center text-sm text-muted-foreground">
                Please sign in to reply to this thread.
            </div>
        );
    }

    return (
        <div className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-zinc-200 shrink-0 overflow-hidden">
                {user.photoURL && <img src={user.photoURL} alt={user.displayName || "User"} className="h-full w-full object-cover" />}
            </div>
            <div className="flex-1 space-y-2">
                <textarea
                    className="w-full min-h-[100px] rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:focus-visible:ring-zinc-300"
                    placeholder={placeholder}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={loading}
                />
                <div className="flex justify-end">
                    <Button onClick={handleSubmit} disabled={loading || !content.trim()}>
                        {loading ? 'Posting...' : 'Post Reply'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
