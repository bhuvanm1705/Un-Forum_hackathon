import { Thread } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MessageSquare, Heart, Eye, Briefcase, MapPin, BookOpen, User, Calendar, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { DeleteThreadButton } from './DeleteThreadButton';
import { cn } from '@/lib/utils'; // Assuming utils exists

interface ThreadListProps {
    threads: Thread[];
    allowDelete?: boolean;
}

export function ThreadList({ threads, allowDelete }: ThreadListProps) {
    if (threads.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                No items found. Be the first to add one!
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {threads.map((thread) => {
                const type = thread.category?.type || 'forum';

                // --- JOB BOARD UI ---
                if (type === 'job') {
                    return (
                        <Card key={thread.id} className="transition-all hover:border-blue-500 border-l-4 border-l-blue-500">
                            <CardContent className="p-6 flex flex-col md:flex-row gap-4 items-start justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Briefcase className="h-4 w-4" />
                                        <span>Full-time</span>
                                        <span>•</span>
                                        <MapPin className="h-4 w-4" />
                                        <span>Remote (India)</span>
                                    </div>
                                    <Link href={`/thread/${thread.id}`} className="hover:underline block">
                                        <h3 className="text-xl font-bold">{thread.title}</h3>
                                    </Link>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="font-semibold">{thread.author.name}</span>
                                        <span className="text-muted-foreground">• Posted {formatDistanceToNow(new Date(thread.createdAt))} ago</span>
                                    </div>
                                </div>
                                <div className="shrink-0 flex gap-2">
                                    <Link href={`/thread/${thread.id}`}>
                                        <Button variant="outline">View Details</Button>
                                    </Link>
                                    <Button>Apply Now</Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                }

                // --- STORYTELLING UI ---
                if (type === 'story') {
                    return (
                        <Card key={thread.id} className="transition-all hover:shadow-lg overflow-hidden group">
                            <div className="flex flex-col md:flex-row">
                                <div className="bg-zinc-100 dark:bg-zinc-800 w-full md:w-32 h-32 md:h-auto flex items-center justify-center shrink-0">
                                    <BookOpen className="h-10 w-10 text-zinc-400 group-hover:text-amber-600 transition-colors" />
                                </div>
                                <div className="p-6 flex-1 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <Link href={`/thread/${thread.id}`} className="hover:underline">
                                            <h3 className="text-xl font-serif font-bold text-amber-900 dark:text-amber-500">{thread.title}</h3>
                                        </Link>
                                        <span className="text-xs font-mono bg-amber-100 text-amber-800 px-2 py-1 rounded">
                                            {thread.replyCount + 1} Chapters
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground line-clamp-2 italic font-serif">
                                        {thread.content}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                                        <span className="flex items-center gap-1"><User className="h-3 w-3" /> {thread.author.name}</span>
                                        <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {thread.likes} Reads</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    );
                }

                // --- ROADMAP UI ---
                if (type === 'roadmap') {
                    return (
                        <Card key={thread.id} className="transition-all hover:bg-zinc-50 border-l-4 border-l-green-500">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <h3 className="font-semibold text-lg">{thread.title}</h3>
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">Planned</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">{thread.content}</p>
                                        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Heart className="h-3 w-3" /> {thread.likes} Votes
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MessageSquare className="h-3 w-3" /> {thread.replyCount} Comments
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                }


                // --- DEFAULT FORUM UI ---
                return (
                    <Card key={thread.id} className="transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Link href={`/thread/${thread.id}`} className="hover:underline">
                                            <CardTitle className="text-xl">{thread.title}</CardTitle>
                                        </Link>
                                        {type === 'qa' && (
                                            <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                                                <CheckCircle className="h-3 w-3" /> Question
                                            </span>
                                        )}
                                    </div>

                                    <CardDescription className="line-clamp-2">
                                        {thread.content}
                                    </CardDescription>
                                </div>
                                {allowDelete && (
                                    <DeleteThreadButton threadId={thread.id} authorId={thread.authorId} />
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className={cn("px-2 py-1 rounded-full", type === 'qa' ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-zinc-100 dark:bg-zinc-800")}>
                                    {thread.category?.name}
                                </span>
                                <span>•</span>
                                <span>Posted by {thread.author.name}</span>
                                <span>•</span>
                                <span>{formatDistanceToNow(new Date(thread.createdAt))} ago</span>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0 text-muted-foreground text-sm flex gap-4">
                            <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                {thread.replyCount}
                            </div>
                            <div className="flex items-center gap-1">
                                <Heart className="h-4 w-4" />
                                {thread.likes}
                            </div>
                            <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {thread.viewCount}
                            </div>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}
