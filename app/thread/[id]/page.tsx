import { getThreadById, getPostsByThreadId, getThreads } from '@/lib/data';
import { Button, buttonVariants } from '@/components/ui/button';
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
                    </div>
                </div>

                <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed text-zinc-800 dark:text-zinc-200">
                    {thread.content}
                </div>

                <div className="flex items-center gap-4 py-4 border-y border-zinc-100 dark:border-zinc-900">
                    <Button variant="ghost" size="sm">
                        <Heart className="mr-2 h-4 w-4" /> {thread.likes}
                    </Button>
                    <Button variant="ghost" size="sm">
                        <MessageSquare className="mr-2 h-4 w-4" /> {thread.replyCount}
                    </Button>
                    <Button variant="ghost" size="sm">
                        <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                    <Button variant="ghost" size="sm" className="ml-auto">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Replies Section */}
            <div className="space-y-6 pt-4">
                <h3 className="text-xl font-semibold">Replies ({thread.replyCount})</h3>

                {/* Simple Reply Box */}
                <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-zinc-200 shrink-0" />
                    <div className="flex-1 space-y-2">
                        <textarea
                            className="w-full min-h-[100px] rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:focus-visible:ring-zinc-300"
                            placeholder="Type your reply here..."
                        />
                        <div className="flex justify-end">
                            <Button>Post Reply</Button>
                        </div>
                    </div>
                </div>

                {/* Post List */}
                <div className="space-y-6">
                    {posts.map((post) => (
                        <div key={post.id} className="flex gap-4 group">
                            <div className="h-10 w-10 rounded-full bg-zinc-200 shrink-0 overflow-hidden">
                                {post.author?.avatar && <img src={post.author.avatar} alt={post.author.name || 'User'} className="h-full w-full object-cover" />}
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-sm">{post.author?.name || 'Anonymous'}</span>
                                        <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(post.createdAt))} ago</span>
                                    </div>
                                </div>
                                <div className="text-zinc-800 dark:text-zinc-200 text-sm leading-relaxed">
                                    {post.content}
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Heart className="h-3 w-3" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MessageSquare className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
