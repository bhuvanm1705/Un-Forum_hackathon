'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Post } from '@/lib/types';

interface ClientPostListProps {
    initialPosts: Post[];
    mode?: 'forum' | 'job' | 'story' | 'qa' | 'roadmap';
}

export function ClientPostList({ initialPosts, mode = 'forum' }: ClientPostListProps) {
    const [visibleCount, setVisibleCount] = useState(50);
    const visiblePosts = initialPosts.slice(0, visibleCount);
    const hasMore = visibleCount < initialPosts.length;

    const showMore = () => {
        setVisibleCount(prev => prev + 50);
    };

    if (initialPosts.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground border rounded-lg border-dashed">
                {mode === 'story' ? "No new chapters yet. Write the next one!" : "No replies yet. Be the first to start the conversation!"}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {visiblePosts.map((post, index) => {
                if (mode === 'story') {
                    // STORY MODE RENDER
                    return (
                        <div key={post.id} className="border-l-4 border-amber-200 pl-6 py-4 space-y-2">
                            <div className="flex items-center justify-between text-xs font-serif text-amber-800 opacity-60 uppercase tracking-widest">
                                <span>Chapter {index + 1}</span>
                                <span>by {post.author?.name || 'Anonymous'}</span>
                            </div>
                            <div className="prose dark:prose-invert font-serif text-lg leading-loose text-zinc-800 dark:text-zinc-300">
                                {post.content}
                            </div>
                        </div>
                    );
                }

                // DEFAULT RENDER
                return (
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
                );
            })}

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
