import { Thread } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { MessageSquare, Heart, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { DeleteThreadButton } from './DeleteThreadButton';

interface ThreadListProps {
    threads: Thread[];
    allowDelete?: boolean;
}

export function ThreadList({ threads, allowDelete }: ThreadListProps) {
    return (
        <div className="space-y-4">
            {threads.map((thread) => (
                <Card key={thread.id} className="transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <Link href={`/thread/${thread.id}`} className="hover:underline">
                                    <CardTitle className="text-xl">{thread.title}</CardTitle>
                                </Link>
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
                            <span className="bg-zinc-100 px-2 py-1 rounded-full dark:bg-zinc-800">
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
            ))}
        </div>
    );
}
