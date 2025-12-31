import { getThreadById, getPostsByThreadId, getThreads } from '@/lib/data';
import { useAuth } from '@/lib/auth';

// ... inside component ...
// Note: We need a client component wrapper or pass user prop if this is a server component.
// app/thread/[id]/page.tsx seems to be a server component (standard in App Router for [id]).
// But to check auth, we need client side or server session. 
// Since we use Firebase client SDK, this page is better as a Server Component rendering a Client Component wrapper OR just the button handles the check?
// The button can handle the check IF we pass the authorId to it.
// The button acts as a client component.
// But we want to SHOW it only if it's the author.
// Since we don't have server-side auth in this setup (using client SDK), we can either:
// 1. Render it always and let the button hide itself?
// 2. Render it and let the button be 'disabled' if not owner?
// Better: The DeleteThreadButton should take authorId and check using useAuth().
import { InteractiveThreadActions } from '@/components/forum/InteractiveThreadActions';
import { ClientPostList } from '@/components/forum/ClientPostList';


import { Button, buttonVariants } from '@/components/ui/button';
import { DeleteThreadButton } from '@/components/forum/DeleteThreadButton';
import { ReplyForm } from '@/components/forum/ReplyForm';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, MessageSquare, Heart, Share2, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cn } from '@/lib/utils';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export async function generateStaticParams() {
    const threads = await getThreads();
    return threads.map((thread) => ({
        id: thread.id,
    }));
}

export const dynamic = 'force-dynamic';

export default async function ThreadPage(props: PageProps) {
    const params = await props.params;
    const thread = await getThreadById(params.id);
    const posts = await getPostsByThreadId(params.id);

    if (!thread) {
        notFound();
    }

    return (
        <div className="space-y-6">
            {/* Back Navigation */}
            <div>
                <Link
                    href="/"
                    className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), "-ml-4 text-muted-foreground")}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Feed
                </Link>
            </div>

            {/* Main Thread Content */}
            <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight">{thread.title}</h1>

                <div className="flex items-center gap-3 text-sm">
                    <div className="h-10 w-10 rounded-full bg-zinc-200 overflow-hidden">
                        {thread.author?.avatar && <img src={thread.author.avatar} alt={thread.author.name || 'Author'} className="h-full w-full object-cover" />}
                    </div>
                    <div>
                        <div className="font-medium">{thread.author?.name || 'Anonymous'}</div>
                        <div className="text-muted-foreground">
                            Posted {formatDistanceToNow(new Date(thread.createdAt))} ago in <span className="font-medium text-foreground">{thread.category?.name || 'Uncategorized'}</span>
                        </div>
                        <div className="mt-2">
                            <DeleteThreadButton threadId={thread.id} authorId={thread.authorId} />
                        </div>
                    </div>
                </div>

                <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed text-zinc-800 dark:text-zinc-200">
                    {thread.content}
                </div>

                <InteractiveThreadActions
                    threadId={thread.id}
                    initialLikes={thread.likes}
                    initialViews={thread.viewCount}
                    replyCount={thread.replyCount}
                />
            </div>

            {/* Replies Section */}
            <div className="space-y-6 pt-4">
                <h3 className="text-xl font-semibold">Replies ({thread.replyCount})</h3>

                {/* Reply Box */}
                <div className="mb-8">
                    <ReplyForm threadId={thread.id} />
                </div>

                {/* Post List */}
                <ClientPostList initialPosts={posts} />
            </div>
        </div >
    );
}
