'use client';

import { useAuth } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { Thread } from '@/lib/types';
import { getThreadsByAuthor } from '@/lib/data';
import { ThreadList } from '@/components/forum/ThreadList';
import { Loader2 } from 'lucide-react';

export default function YourThreadsPage() {
    const { user, loading: authLoading } = useAuth();
    const [threads, setThreads] = useState<Thread[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUserThreads() {
            if (user) {
                const data = await getThreadsByAuthor(user.uid);
                setThreads(data);
            }
            setLoading(false);
        }

        if (!authLoading) {
            fetchUserThreads();
        }
    }, [user, authLoading]);

    if (authLoading || loading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

    if (!user) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold mb-4">Sign in to view your threads</h1>
                <p className="text-muted-foreground">You need to be logged in to track your discussions.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Your Threads</h1>
            {threads.length > 0 ? (
                <ThreadList threads={threads} allowDelete={true} />
            ) : (
                <div className="text-center py-12 border border-dashed rounded-lg">
                    <p className="text-muted-foreground">You haven't posted any threads yet.</p>
                </div>
            )}
        </div>
    );
}
