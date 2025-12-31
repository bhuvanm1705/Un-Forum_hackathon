'use client';

import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Share2, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { incrementThreadLikes, incrementThreadViews } from '@/lib/firestore';
import { formatNumber } from '@/lib/utils'; // Assuming this exists or I'll just use simple formatting

export function InteractiveThreadActions({
    threadId,
    initialLikes,
    initialViews,
    replyCount
}: {
    threadId: string,
    initialLikes: number,
    initialViews: number,
    replyCount: number
}) {
    const [likes, setLikes] = useState(initialLikes);
    const [views, setViews] = useState(initialViews + 1); // Optimistically increment view
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        // Increment view count on mount
        incrementThreadViews(threadId);
    }, [threadId]);

    const handleLike = async () => {
        if (liked) return; // Prevent spamming
        setLiked(true);
        setLikes(prev => prev + 1);
        await incrementThreadLikes(threadId);
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
    };

    return (
        <div className="flex items-center gap-4 py-4 border-y border-zinc-100 dark:border-zinc-900">
            <Button
                variant={liked ? "secondary" : "ghost"}
                size="sm"
                onClick={handleLike}
                className={liked ? "text-red-500" : ""}
            >
                <Heart className={`mr-2 h-4 w-4 ${liked ? "fill-current" : ""}`} /> {likes}
            </Button>
            <Button variant="ghost" size="sm">
                <MessageSquare className="mr-2 h-4 w-4" /> {replyCount}
            </Button>
            <Button variant="ghost" size="sm" className="cursor-default hover:bg-transparent">
                <Eye className="mr-2 h-4 w-4 text-muted-foreground" /> {views}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
        </div>
    );
}
