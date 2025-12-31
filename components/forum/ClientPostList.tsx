'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Post } from '@/lib/types';

interface ClientPostListProps {
    initialPosts: Post[];
}

export function ClientPostList({ initialPosts }: ClientPostListProps) {
    const [visibleCount, setVisibleCount] = useState(50);

    // Sort posts by date (oldest first usually for comments, or newest depending on pref. Firestore query was ASC (oldest first))
    // We'll trust the order passed from props (which comes from firestore query)
    const visiblePosts = initialPosts.slice(0, visibleCount);
    const hasMore = visibleCount < initialPosts.length;

    const showMore = () => {
        setVisibleCount(prev => prev + 50);
    };

    if (initialPosts.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground border rounded-lg border-dashed">
                No replies yet. Be the first to start the conversation!
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {visiblePosts.map((post) => (
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

            {hasMore && (
                <div className="flex justify-center pt-4">
                    <Button variant="outline" onClick={showMore} className="w-full md:w-auto">
                        Show More Comments ({initialPosts.length - visibleCount} remaining)
                    </Button>
                </div>
            )}
        </div>
    );
}
