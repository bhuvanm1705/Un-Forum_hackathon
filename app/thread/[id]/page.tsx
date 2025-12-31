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
import { ArrowLeft, MessageSquare, Heart, Share2, MoreHorizontal, Briefcase, MapPin, BookOpen, CheckCircle, Clock } from 'lucide-react';
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

    const type = thread.category?.type || 'forum';

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

            {/* --- LAYOUT SWITCHER --- */}

            {/* JOB BOARD LAYOUT */}
            {type === 'job' && (
                <div className="space-y-6">
                    <div className="bg-white dark:bg-zinc-900 border rounded-xl p-8 shadow-sm">
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                            <div className="space-y-4">
                                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{thread.title}</h1>
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full"><Briefcase className="h-4 w-4" /> Full-time</span>
                                    <span className="flex items-center gap-1 bg-zinc-100 text-zinc-700 px-3 py-1 rounded-full"><MapPin className="h-4 w-4" /> Remote</span>
                                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> Posted {formatDistanceToNow(new Date(thread.createdAt))} ago</span>
                                </div>
                            </div>
                            <Button size="lg" className="w-full md:w-auto text-lg h-12 px-8">Apply for Position</Button>
                        </div>
                        <hr className="my-8 border-zinc-100 dark:border-zinc-800" />
                        <div className="prose dark:prose-invert max-w-none">
                            <h3 className="text-xl font-semibold mb-4">Job Description</h3>
                            {thread.content}
                        </div>
                    </div>
                </div>
            )}

            {/* STORY/BOOK LAYOUT */}
            {type === 'story' && (
                <div className="space-y-8 max-w-2xl mx-auto">
                    <div className="text-center space-y-4 py-8">
                        <div className="inline-flex items-center justify-center p-4 bg-amber-50 rounded-full mb-4">
                            <BookOpen className="h-12 w-12 text-amber-600" />
                        </div>
                        <h1 className="text-5xl font-serif font-bold text-amber-950 dark:text-amber-500">{thread.title}</h1>
                        <p className="text-lg text-muted-foreground italic font-serif">by {thread.author?.name}</p>
                    </div>
                    <div className="prose dark:prose-invert max-w-none font-serif text-lg leading-loose border-l-4 border-amber-200 pl-6 py-2">
                        <span className="text-4xl float-left mr-2 font-bold text-amber-500">I</span>
                        {thread.content}
                    </div>
                    <hr className="border-amber-100 dark:border-zinc-800" />
                </div>
            )}

            {/* ROADMAP / FEATURE REQUEST LAYOUT */}
            {type === 'roadmap' && (
                <div className="flex gap-6">
                    {/* Vote Column */}
                    <div className="flex flex-col items-center gap-2 pt-2">
                        <div className="flex flex-col items-center gap-1 bg-zinc-50 dark:bg-zinc-900 border rounded-lg p-2 min-w-[60px]">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-transparent hover:text-orange-500">
                                <ArrowLeft className="h-6 w-6 rotate-90" /> {/* Up Arrow hack using ArrowLeft */}
                            </Button>
                            <span className="font-bold text-lg">{thread.likes || 0}</span>
                        </div>
                    </div>

                    <div className="space-y-6 flex-1">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                                    Under Review
                                </span>
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> Target: Q3 2024
                                </span>
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight">{thread.title}</h1>

                            <div className="flex items-center gap-3 text-sm border-b pb-6">
                                <div className="h-8 w-8 rounded-full bg-zinc-200 overflow-hidden">
                                    {thread.author?.avatar && <img src={thread.author.avatar} alt={thread.author.name || 'Author'} className="h-full w-full object-cover" />}
                                </div>
                                <div>
                                    <span className="font-medium">{thread.author?.name || 'Anonymous'}</span> proposed this feature {formatDistanceToNow(new Date(thread.createdAt))} ago
                                </div>
                            </div>
                        </div>

                        <div className="prose dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-200">
                            {thread.content}
                        </div>

                        <div className="flex gap-2 pt-4">
                            <DeleteThreadButton threadId={thread.id} authorId={thread.authorId} />
                        </div>
                    </div>
                </div>
            )}

            {/* DEFAULT & Q&A (Roadmap moved above) */}
            {(type === 'forum' || type === 'qa') && (
                <div className="space-y-4">
                    <div className="space-y-2">
                        {type === 'qa' && (
                            <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" /> Question
                            </span>
                        )}
                        <h1 className="text-3xl font-bold tracking-tight">{thread.title}</h1>
                        <div className="flex items-center gap-3 text-sm">
                            <div className="h-10 w-10 rounded-full bg-zinc-200 overflow-hidden">
                                {thread.author?.avatar && <img src={thread.author.avatar} alt={thread.author.name || 'Author'} className="h-full w-full object-cover" />}
                            </div>
                            <div>
                                <div className="font-medium">{thread.author?.name || 'Anonymous'}</div>
                                <div className="text-muted-foreground">
                                    Posted {formatDistanceToNow(new Date(thread.createdAt))} ago
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed text-zinc-800 dark:text-zinc-200 border-l-4 pl-4 border-zinc-200 dark:border-zinc-700">
                        {thread.content}
                    </div>

                    <div className="flex gap-2 pt-4">
                        <DeleteThreadButton threadId={thread.id} authorId={thread.authorId} />
                        <InteractiveThreadActions
                            threadId={thread.id}
                            initialLikes={thread.likes}
                            initialViews={thread.viewCount}
                            replyCount={thread.replyCount}
                        />
                    </div>
                </div>
            )}


            {/* Replies Section */}
            <div className="space-y-6 pt-8 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-semibold">
                        {type === 'story' ? 'Chapters' : type === 'qa' ? 'Answers' : 'Comments'} ({thread.replyCount})
                    </h3>
                </div>

                {/* Reply Box */}
                <div className="mb-8">
                    <ReplyForm threadId={thread.id} placeholder={type === 'story' ? "Write the next chapter..." : "Write a reply..."} />
                </div>

                {/* Post List */}
                <ClientPostList initialPosts={posts} mode={type} />
            </div>
        </div >
    );
}
